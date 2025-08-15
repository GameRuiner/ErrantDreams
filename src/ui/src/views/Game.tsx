import React, { useState, useEffect, useRef } from "react";
import styles from "../css/game.module.css";
import { toast } from "react-toastify";

interface Message {
  id: string;
  type: 'system' | 'player' | 'global' | 'faction';
  sender?: string;
  content: string;
  timestamp: Date;
  channel?: string;
}

interface Character {
  id: number;
  name: string;
  faction: string;
  race: string;
  character_class: string;
  level: number;
  gold: number;
}

const Game: React.FC = () => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [currentChannel, setCurrentChannel] = useState<'global' | 'faction'>('global');
  const [isChatExpanded, setIsChatExpanded] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load character from localStorage
    const storedCharacter = localStorage.getItem('character');
    if (storedCharacter) {
      const char = JSON.parse(storedCharacter);
      setCharacter(char);
      addSystemMessage(`Welcome to the world, ${char.name}!`);
      addSystemMessage("Use the chat to communicate with world.");
    } else {
      toast.error("No character found. Redirecting to character creation...");
      setTimeout(() => {
        window.location.href = '/faction-selection';
      }, 2000);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addSystemMessage = (content: string) => {
    const message: Message = {
      id: Date.now().toString(),
      type: 'system',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
  };

  const addPlayerMessage = (content: string, channel: 'global' | 'faction') => {
    if (!character) return;

    const message: Message = {
      id: Date.now().toString(),
      type: 'player',
      sender: character.name,
      content,
      timestamp: new Date(),
      channel
    };
    setMessages(prev => [...prev, message]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentMessage.trim()) return;
    if (!character) return;

    const message = currentMessage.trim();

    // Handle commands
    if (message.startsWith('/')) {
      handleCommand(message);
    } else {
      // Send regular message
      addPlayerMessage(message, currentChannel);
      
      // TODO: Send to backend/websocket
      console.log(`[${currentChannel.toUpperCase()}] ${character.name}: ${message}`);
    }

    setCurrentMessage("");
  };

  const handleCommand = (command: string) => {
    const [cmd, ...args] = command.split(' ');
    
    switch (cmd.toLowerCase()) {
      case '/help':
        addSystemMessage("Available commands:");
        addSystemMessage("/help - Show this help message");
        addSystemMessage("/who - Show online players");
        addSystemMessage("/time - Show game time");
        addSystemMessage("/stats - Show your character stats");
        break;
        
      case '/who':
        addSystemMessage("Online Players:");
        addSystemMessage(`• ${character?.name} (You) - Level ${character?.level} ${character?.race} ${character?.character_class}`);
        addSystemMessage("• [Other players would appear here]");
        break;
        
      case '/time':
        addSystemMessage(`Current time: ${new Date().toLocaleTimeString()}`);
        break;
        
      case '/stats':
        if (character) {
          addSystemMessage(`=== ${character.name}'s Stats ===`);
          addSystemMessage(`Race: ${character.race}`);
          addSystemMessage(`Class: ${character.character_class}`);
          addSystemMessage(`Faction: ${character.faction}`);
          addSystemMessage(`Level: ${character.level}`);
          addSystemMessage(`Gold: ${character.gold}`);
        }
        break;
        
      default:
        addSystemMessage(`Unknown command: ${cmd}. Type /help for available commands.`);
    }
  };

  const getMessageClass = (message: Message) => {
    switch (message.type) {
      case 'system':
        return styles.systemMessage;
      case 'player':
        return message.sender === character?.name ? styles.ownMessage : styles.playerMessage;
      default:
        return styles.playerMessage;
    }
  };

  const getChannelColor = (channel?: string) => {
    switch (channel) {
      case 'faction':
        return styles.factionChannel;
      case 'global':
        return styles.globalChannel;
      default:
        return '';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!character) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading your adventure...</p>
      </div>
    );
  }

  return (
    <div className={styles.gameContainer}>
      {/* Game Header */}
      <div className={styles.gameHeader}>
        <div className={styles.characterInfo}>
          <h2>{character.name}</h2>
          <span className={styles.characterDetails}>
            Level {character.level} {character.race} {character.character_class} | {character.gold} Gold
          </span>
        </div>
        
        <div className={styles.headerActions}>
          <button 
            className={styles.chatToggle}
            onClick={() => setIsChatExpanded(!isChatExpanded)}
          >
            💬 {isChatExpanded ? 'Hide Chat' : 'Show Chat'}
          </button>
          <button 
            className={styles.menuButton}
          >
            📋 Menu
          </button>
        </div>
      </div>

      {/* Main Game Area */}
      <div className={styles.gameContent}>
        {/* Game World Placeholder */}
        {/* <div className={styles.gameWorld}>
          <div className={styles.worldPlaceholder}>
            <h3>🌍 Game World</h3>
            <p>Your adventure awaits...</p>
            <p className={styles.comingSoon}>
              [Game world content will be implemented here]
            </p>
            <div className={styles.quickActions}>
              <button className={styles.actionBtn}>⚔️ Battle</button>
              <button className={styles.actionBtn}>🏰 Town</button>
              <button className={styles.actionBtn}>🗺️ Explore</button>
              <button className={styles.actionBtn}>🎒 Inventory</button>
            </div>
          </div>
        </div> */}

        {/* Chat Panel */}
        {isChatExpanded && (
          <div className={styles.chatPanel}>
            {/* <div className={styles.chatHeader}>
              <div className={styles.channelTabs}>
                <button 
                  className={`${styles.channelTab} ${currentChannel === 'global' ? styles.active : ''}`}
                  onClick={() => setCurrentChannel('global')}
                >
                  🌍 Global
                </button>
                <button 
                  className={`${styles.channelTab} ${currentChannel === 'faction' ? styles.active : ''}`}
                  onClick={() => setCurrentChannel('faction')}
                >
                  {character.faction === 'The Crusaders' ? '🛡️' : '🌙'} Faction
                </button>
              </div>
            </div> */}

            <div className={styles.chatMessages}>
              {messages.map((message) => (
                <div key={message.id} className={`${styles.message} ${getMessageClass(message)}`}>
                  <span className={styles.timestamp}>
                    {formatTimestamp(message.timestamp)}
                  </span>                  
                  {message.sender && (
                    <span className={styles.sender}>
                      {message.sender}:
                    </span>
                  )}
                  
                  <span className={styles.content}>
                    {message.content}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form className={styles.chatInput} onSubmit={handleSendMessage}>
              <input
                ref={chatInputRef}
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder={`Message`}
                maxLength={200}
              />
              <button type="submit" disabled={!currentMessage.trim()}>
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
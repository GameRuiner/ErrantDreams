import React, { useState } from "react";
import styles from "../css/faction-selection.module.css";
import { toast } from "react-toastify";

interface Race {
  name: string;
  description: string;
  traits: string[];
}

const FactionSelectionPage: React.FC = () => {
  const [selectedFaction, setSelectedFaction] = useState<string | null>(null);
  const [selectedRace, setSelectedRace] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'faction' | 'race'>('faction');

  const crusaderRaces: Race[] = [
    {
      name: 'Castilian',
      description: 'Proud and resolute, the Castilians uphold chivalry and honor above all, excelling in heavy cavalry and fortified defenses.',
      traits: ['[Trait 1]', '[Trait 2]']
    },
    {
      name: 'Aragonese', 
      description: 'Naval-savvy and adaptable, the Aragonese bring Mediterranean cunning and versatile tactics to the battlefield.',
      traits: ['[Trait 1]', '[Trait 2]']
    },
    {
      name: 'Leonese',
      description: 'Devout and disciplined, the Leonese blend strong infantry lines with enduring morale in long campaigns.', 
      traits: ['[Trait 1]', '[Trait 2]']
    }
  ];

  const moorRaces: Race[] = [
    {
      name: 'Andalusian',
      description: 'Learned and cosmopolitan, the Andalusians harness advanced science, culture, and architecture to empower their cities and armies.',
      traits: ['[Trait 1]', '[Trait 2]']
    },
    {
      name: 'Berber',
      description: 'Swift and mobile, Berbers strike from the deserts with unmatched speed and mastery of guerrilla tactics.',
      traits: ['[Trait 1]', '[Trait 2]']
    },
    {
      name: 'Mashriqi',
      description: 'Steeped in eastern traditions, the Mashriqi bring refined military doctrine, elite units, and distant wisdom to the Iberian front.',
      traits: ['[Trait 1]', '[Trait 2]']
    }
  ];

  const getCurrentRaces = (): Race[] => {
    return selectedFaction === 'The Crusaders' ? crusaderRaces : moorRaces;
  };

  const handleFactionSelect = (faction: string) => {
    setSelectedFaction(faction);
  };

  const handleRaceSelect = (race: string) => {
    setSelectedRace(race);
  };

  const handleContinueToRace = () => {
    if (!selectedFaction) {
      toast.error("Please select a faction before continuing.");
      return;
    }
    setStep('race');
  };

  const handleBackToFaction = () => {
    setStep('faction');
    setSelectedRace(null);
  };

  const handleConfirmSelection = async () => {
    if (!selectedFaction) {
      toast.error("Please select a faction before continuing.");
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Send faction selection to backend
      toast.success(`Welcome, ${selectedRace} of ${selectedFaction}! Your journey begins...`);
      
      // TODO: Navigate to game/character creation
      setTimeout(() => {
        window.location.href = '/game';
      }, 2000);
      
    } catch (err) {
      toast.error("Failed to save selections. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'race') {
    return (
      <div className={styles.container}>
        <div className={styles.selectionCard}>
          <h1 className={styles.title}>Choose your heritage</h1>
          <p className={styles.subtitle}>
            As a warrior of {selectedFaction}, select your ancestral lineage.
            Each race brings unique strengths to the battlefield.
          </p>

          <div className={styles.racesContainer}>
            {getCurrentRaces().map((race) => (
              <div 
                key={race.name}
                className={`${styles.raceCard} ${selectedRace === race.name ? styles.selected : ''}`}
                onClick={() => handleRaceSelect(race.name)}
              >
                <div className={styles.raceHeader}>
                  <h3 className={styles.raceName}>{race.name}</h3>
                </div>
                
                <div className={styles.raceDescription}>
                  <p>{race.description}</p>
                </div>

                <div className={styles.raceTraits}>
                  {race.traits.map((trait, index) => (
                    <div key={index} className={styles.trait}>
                      <span className={styles.traitValue}>{trait}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.selectionFooter}>
            <div className={styles.buttonGroup}>
              <button 
                className={styles.backButton}
                onClick={handleBackToFaction}
              >
                Back to factions
              </button>
              
              <button 
                className={`${styles.confirmButton} ${!selectedRace ? styles.disabled : ''}`}
                onClick={handleConfirmSelection}
                disabled={isLoading || !selectedRace}
              >
                {isLoading ? 'Creating Character...' : `Begin as ${selectedRace || 'Selected Race'}`}
              </button>
            </div>

            <p className={styles.warningText}>
              Your faction and race choices are permanent
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.selectionCard}>
        <h1 className={styles.title}>Choose your allegiance</h1>
        <p className={styles.subtitle}>
          In this world torn by holy war, your choice will shape your destiny. 
          Choose wisely, for there is no turning back.
        </p>

        <div className={styles.factionsContainer}>
          <div 
            className={`${styles.factionCard} ${selectedFaction === 'The Crusaders' ? styles.selected : ''}`}
            onClick={() => handleFactionSelect('The Crusaders')}
          >
            <div className={styles.factionHeader}>
              <h2 className={styles.factionName}>The Crusaders</h2>
              <div className={styles.factionSymbol}>🛡️</div>
            </div>
            
            <div className={styles.factionDescription}>
              <p>
                Forged in the fires of holy wars, the Crusaders are armored knights, devout warriors, and disciplined tacticians. Backed by the power of Christian kingdoms like León, Castile, and Aragon, they march south under the banner of faith, seeking to reclaim the land and impose order through steel and scripture. Honor, hierarchy, and divine justice guide their every step.
              </p>
            </div>
          </div>

          <div 
            className={`${styles.factionCard} ${selectedFaction === 'The Moors' ? styles.selected : ''}`}
            onClick={() => handleFactionSelect('The Moors')}
          >
            <div className={styles.factionHeader}>
              <h2 className={styles.factionName}>The Moors</h2>
              <div className={styles.factionSymbol}>🌙</div>
            </div>
            
            <div className={styles.factionDescription}>
              <p>
                Masters of science, strategy, and the scimitar, the Moors are heirs to centuries of knowledge and culture. Hailing from the once-flourishing Caliphate of Córdoba, they now fight to preserve their rich traditions, defend their cities, and resist the encroaching crusade. Swift, cunning, and resourceful, the Moors turn every battle into an art form.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.selectionFooter}>
          <button 
            className={`${styles.confirmButton} ${!selectedFaction ? styles.disabled : ''}`}
            onClick={handleContinueToRace}
            disabled={!selectedFaction}
          >
            Continue to heritage selection
          </button>

          <p className={styles.warningText}>
            This choice is permanent and will affect your entire journey
          </p>
        </div>
      </div>
    </div>
  );
};

export default FactionSelectionPage;
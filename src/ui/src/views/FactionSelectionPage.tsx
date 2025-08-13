import React, { useState } from "react";
import styles from "../css/faction-selection.module.css";
import { toast } from "react-toastify";
import axios from "axios";

interface Race {
  name: string;
  description: string;
  traits: string[];
}

interface CharacterClass {
  name: string;
  description: string;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const CHARACTER_CREATE_URL = `${BACKEND_URL}/api/character/create`;

const FactionSelectionPage: React.FC = () => {
  const [selectedFaction, setSelectedFaction] = useState<string | null>(null);
  const [selectedRace, setSelectedRace] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'faction' | 'race' | 'class'>('faction');

  const crusaderRaces: Race[] = [
    {
      name: 'Castilian',
      description: 'Proud and resolute, the Castilians uphold chivalry and honor above all, excelling in heavy cavalry and fortified defenses.',
      traits: ['Bonus damage when using swords or polearms', 'Bonus charisma', '+5% resistance to debuffs']
    },
    {
      name: 'Aragonese',
      description: 'Naval-savvy and adaptable, the Aragonese bring Mediterranean cunning and versatile tactics to the battlefield.',
      traits: ['+10% bonus gold', 'Bonus intelligence', 'Bonus damage when using crossbows or knives']
    },
    {
      name: 'Leonese',
      description: 'Devout and disciplined, the Leonese blend strong infantry lines with enduring morale in long campaigns.',
      traits: ['+10% bonus agility', '+5% crit chance when using light weapons (knives, throwing weapons, curved blades)', '+5% resistance to debuffs']
    }
  ];

  const moorRaces: Race[] = [
    {
      name: 'Andalusian',
      description: 'Learned and cosmopolitan, the Andalusians harness advanced science, culture, and architecture to empower their cities and armies.',
      traits: ['+10% damage with curved blades and throwing weapons', 'Potions are 10% stronger', 'Bonus charisma']
    },
    {
      name: 'Berber',
      description: 'Swift and mobile, Berbers strike from the deserts with unmatched speed and mastery of guerrilla tactics.',
      traits: ['+5% evasion chance', 'Increased ranged accuracy', 'Bonus agility']
    },
    {
      name: 'Mashriqi',
      description: 'Steeped in eastern traditions, the Mashriqi bring refined military doctrine, elite units, and distant wisdom to the Iberian front.',
      traits: ['+10% damage with bows and curved blades', 'Faster ability cooldowns (10%)', 'Bonus intelligence']
    }
  ];

  const characterClasses: CharacterClass[] = [
    {
      name: 'Knight',
      description: 'The quintessential mounted warrior, embodying the ideals of chivalry and martial prowess.',
    },
    {
      name: 'Arbalist',
      description: 'An arbalist is a soldier who uses a crossbow, a powerful ranged physical weapon common in medieval warfare.',
    },
    {
      name: 'Skirmisher',
      description: 'A light and mobile ranged unit, adept at hit-and-run tactics. They utilize javelins or short bows for rapid attacks, harassing enemies from a distance before repositioning.',
    },
    {
      name: 'Blade Dancer',
      description: 'A highly agile and swift melee combatant, specializing in fluid movements and quick, precise strikes with curved blades',
    },
    {
      name: 'Alchemist',
      description: 'A master of ancient knowledge and elemental forces, capable of brewing potent concoctions for both offensive (acid, fire) and supportive (healing, buffs) effects',
    },
    {
      name: 'Mystic Poet',
      description: 'A bardic class that weaves magic into their verses, inspiring allies and bewildering foes with enchanting performances.',
    }
  ];

  const raceClassCompatibility: Record<string, string[]> = {
    'Castilian': ['Knight', 'Arbalist'],
    'Aragonese': ['Knight', 'Arbalist', 'Skirmisher', 'Alchemist'],
    'Leonese': ['Knight', 'Arbalist', 'Mystic Poet'],
    'Andalusian': ['Skirmisher', 'Blade Dancer', 'Alchemist', 'Mystic Poet'],
    'Berber': ['Arbalist', 'Skirmisher', 'Blade Dancer'],
    'Mashriqi': ['Blade Dancer', 'Alchemist', 'Mystic Poet']
  };

  const getCurrentRaces = (): Race[] => {
    return selectedFaction === 'The Crusaders' ? crusaderRaces : moorRaces;
  };

  const getAvailableClasses = (): CharacterClass[] => {
    return characterClasses;
  };

  const isClassAvailable = (className: string): boolean => {
    if (!selectedRace) return false;
    const availableClassNames = raceClassCompatibility[selectedRace] || [];
    return availableClassNames.includes(className);
  };

  const getClassAvailableRaces = (className: string): string[] => {
    const availableRaces: string[] = [];
    Object.entries(raceClassCompatibility).forEach(([race, classes]) => {
      if (classes.includes(className)) {
        availableRaces.push(race);
      }
    });
    return availableRaces;
  };

  const handleFactionSelect = (faction: string) => {
    setSelectedFaction(faction);
  };

  const handleRaceSelect = (race: string) => {
    setSelectedRace(race);
  };

  const handleClassSelect = (className: string) => {
    if (isClassAvailable(className)) {
      setSelectedClass(className);
    }
  };

  const handleContinueToRace = () => {
    if (!selectedFaction) {
      toast.error("Please select a faction before continuing.");
      return;
    }
    setStep('race');
  };

  const handleContinueToClass = () => {
    if (!selectedRace) {
      toast.error("Please select a race before continuing.");
      return;
    }
    setStep('class');
  };

  const handleBackToFaction = () => {
    setStep('faction');
    setSelectedRace(null);
    setSelectedClass(null);
  };

  const handleBackToRace = () => {
    setStep('race');
    setSelectedClass(null);
  };

  const handleConfirmSelection = async () => {
    if (!selectedFaction || !selectedRace || !selectedClass) {
      toast.error("Please complete all selections before continuing.");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("You must be logged in to create a character.");
        return;
      }
      const res = await axios.post(CHARACTER_CREATE_URL, {
        faction: selectedFaction,
        race: selectedRace,
        character_class: selectedClass,
        name: `${selectedRace} ${selectedClass}`
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = res.data;

      if (data.success === true) {
        toast.success(data.message);

        if (data.character) {
          localStorage.setItem('character', JSON.stringify(data.character));
        }

        setTimeout(() => {
          window.location.href = '/game';
        }, 2000);

      } else {
        toast.error(data.message || "Failed to create character. Please try again.");
      }

    } catch (err: any) {
      console.error("Character creation error:", err);

      if (err.response?.status === 401) {
        toast.error("Your session has expired. Please log in again.");
        localStorage.removeItem('token');
      } else if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Failed to create character. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Class Selection Step
  if (step === 'class') {
    return (
      <div className={styles.container}>
        <div className={styles.selectionCard}>
          <h1 className={styles.title}>Choose your path</h1>
          <p className={styles.subtitle}>
            As a {selectedRace} of {selectedFaction}, select your calling.
            Each class offers unique abilities and combat styles.
          </p>

          <div className={styles.classesContainer}>
            {getAvailableClasses().map((characterClass) => {
              const isAvailable = isClassAvailable(characterClass.name);
              const availableRaces = getClassAvailableRaces(characterClass.name);

              return (
                <div
                  key={characterClass.name}
                  className={`${styles.classCard} ${selectedClass === characterClass.name ? styles.selected : ''
                    } ${!isAvailable ? styles.disabled : ''}`}
                  onClick={() => handleClassSelect(characterClass.name)}
                >
                  <div className={styles.classHeader}>
                    <h3 className={styles.className}>{characterClass.name}</h3>
                    {!isAvailable && (
                      <span className={styles.unavailableTag}>Unavailable</span>
                    )}
                  </div>

                  <div className={styles.classDescription}>
                    <p>{characterClass.description}</p>
                  </div>

                  {!isAvailable && (
                    <div className={styles.availabilityInfo}>
                      <p className={styles.availabilityText}>
                        Available to: {availableRaces.join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className={styles.selectionFooter}>
            <div className={styles.buttonGroup}>
              <button
                className={styles.backButton}
                onClick={handleBackToRace}
              >
                Back to heritage
              </button>

              <button
                className={`${styles.confirmButton} ${!selectedClass ? styles.disabled : ''}`}
                onClick={handleConfirmSelection}
                disabled={isLoading || !selectedClass}
              >
                {isLoading ? 'Creating Character...' : `Begin as ${selectedClass || 'Selected Class'}`}
              </button>
            </div>

            <p className={styles.warningText}>
              All choices are permanent and will shape your journey
            </p>
          </div>
        </div>
      </div>
    );
  }

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
                onClick={handleContinueToClass}
                disabled={!selectedRace}
              >
                Continue to class selection
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
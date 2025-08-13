# Profiles Folder Documentation

The `profiles` folder is a critical component of LawinServer that contains JSON files representing different Fortnite game profiles and player data. This folder essentially acts as a file-based database that stores all player progression, items, cosmetics, and game state information that would normally be stored on Epic Games' servers.

## Overview

LawinServer is a private Fortnite backend server that supports both Battle Royale (BR) and Save the World (STW) game modes. The profiles folder contains individual JSON files that represent different aspects of a player's game data, following Epic Games' MCP (My Content Profile) system structure.

## Profile File Structure

Each profile file follows a standardized JSON structure:

```json
{
  "_id": "LawinServer",
  "created": "0001-01-01T00:00:00.000Z",
  "updated": "0001-01-01T00:00:00.000Z",
  "rvn": 1,
  "wipeNumber": 1,
  "accountId": "LawinServer",
  "profileId": "profile_name",
  "version": "no_version",
  "items": {
    // Game items, cosmetics, quests, etc.
  },
  "stats": {
    "attributes": {
      // Player statistics and attributes
    }
  },
  "commandRevision": 0
}
```

### Key Fields:
- **`_id`**: Unique identifier for the profile
- **`rvn`**: Revision number, incremented when the profile is modified
- **`accountId`**: Player account identifier
- **`profileId`**: Specific profile type identifier
- **`items`**: Contains all game items, cosmetics, quests, resources, etc.
- **`stats.attributes`**: Contains player statistics, progression data, and settings

## Profile Files Explained

### 1. `athena.json` - Battle Royale Profile
**Purpose**: Stores Battle Royale game data including cosmetics, locker setup, and Battle Pass progression.

**Key Contents**:
- Cosmetic locker configuration (skins, emotes, pickaxes, etc.)
- Battle Pass level and XP
- Season progression data
- Daily challenges and quests
- Item shop purchases
- Settings and preferences

**Example Items**:
```json
"lawin-loadout": {
  "templateId": "CosmeticLocker:cosmeticlocker_athena",
  "attributes": {
    "locker_slots_data": {
      "slots": {
        "Character": {"items": [""]},
        "Backpack": {"items": [""]},
        "Dance": {"items": ["AthenaDance:eid_dancemoves"]}
      }
    }
  }
}
```

### 2. `common_core.json` - Core Game Data
**Purpose**: Contains shared game data across all game modes.

**Key Contents**:
- V-Bucks and other currencies
- Founder's Pack tokens
- Support-A-Creator codes
- Account-wide settings
- Core game tokens and access rights

**Example Items**:
```json
"Currency": {
  "templateId": "Currency:MtxPurchased",
  "attributes": {"platform": "EpicPC"},
  "quantity": 10000000
}
```

### 3. `profile0.json` - Save the World Main Profile
**Purpose**: Primary Save the World profile containing quest progression and main game data.

**Key Contents**:
- Main campaign quests
- Story progression
- Mission completion data
- Quest rewards and objectives

### 4. `campaign.json` - Campaign Data
**Purpose**: Specific campaign and quest data for Save the World.

**Key Contents**:
- Hero quests
- Campaign progression
- Special event quests
- Quest completion states

### 5. `theater0.json` - Save the World Inventory
**Purpose**: Contains player inventory, resources, and materials for Save the World.

**Key Contents**:
- Crafting materials (blast powder, ores, etc.)
- Building materials
- Weapons and traps
- Hero and survivor items
- Resource quantities

**Example Items**:
```json
"3d81f6f3-1290-326e-dfee-e577af2e9fbb": {
  "templateId": "Ingredient:ingredient_blastpowder",
  "attributes": {
    "level": 0,
    "durability": 1
  },
  "quantity": 999
}
```

### 6. `outpost0.json` - Base Building Data
**Purpose**: Stores Save the World base building and outpost information.

**Key Contents**:
- Base layouts and structures
- Placed buildings and defenses
- Outpost configurations
- Construction progress

### 7. `collection_book_people0.json` - Collection Book Heroes
**Purpose**: Manages the Collection Book system for heroes and people items.

**Key Contents**:
- Hero collection pages
- Slotted heroes and defenders
- Collection Book progression
- Page unlock states

### 8. `collection_book_schematics0.json` - Collection Book Schematics
**Purpose**: Manages the Collection Book system for weapons and schematics.

**Key Contents**:
- Weapon and trap schematics
- Schematic collection pages
- Collection Book XP and rewards

### 9. `collections.json` - General Collections
**Purpose**: Handles various collection systems and achievements.

### 10. `metadata.json` - Game Metadata
**Purpose**: Contains game save metadata and cloud save information.

**Key Contents**:
- Cloud save records
- Outpost core information
- Save file management data

### 11. `creative.json` - Creative Mode Profile
**Purpose**: Stores Creative mode data (currently minimal implementation).

**Key Contents**:
- Creative islands
- Published creations
- Creative mode settings

### 12. `common_public.json` - Public Shared Data
**Purpose**: Contains publicly shared data and settings.

## How Profiles Work with the Server

### Profile Loading and Management
The server automatically loads all profile files during startup and maintains them in memory. The MCP system (`structure/mcp.js`) handles:

1. **Profile Initialization**: Ensures all required fields exist
2. **Revision Management**: Tracks changes with the `rvn` field
3. **Data Persistence**: Saves changes back to JSON files
4. **Profile Synchronization**: Handles client-server data sync

### Profile Operations
Common operations performed on profiles include:

- **Item Addition**: Adding new cosmetics, weapons, or resources
- **Quest Updates**: Progressing quest objectives and completion
- **Stat Modifications**: Updating player statistics and attributes
- **Locker Changes**: Modifying cosmetic loadouts
- **Purchase Transactions**: Handling item shop purchases

### Example Profile Update Flow
```javascript
// Load profile
const profile = require(`./../profiles/${profileId}.json`);

// Modify profile data
profile.items[itemId] = newItem;
profile.rvn += 1;

// Save profile back to file
fs.writeFileSync(`./profiles/${profileId}.json`, JSON.stringify(profile, null, 2));
```

## Configuration and Customization

### Adding New Items
To add items to profiles:

1. Create the item object with proper `templateId` and `attributes`
2. Add it to the appropriate profile's `items` object
3. Ensure the item follows Epic Games' template naming conventions

### Modifying Player Stats
Player statistics can be modified in the `stats.attributes` section of profiles:

```json
"stats": {
  "attributes": {
    "season_num": 10,
    "book_level": 50,
    "mtx_affiliate": "CREATOR_CODE"
  }
}
```

### Profile Validation
The server performs basic validation on profiles:
- Ensures required fields exist
- Initializes missing objects
- Manages revision numbers
- Handles command revisions for change tracking

## Technical Notes

### File Format
- All profiles are stored as formatted JSON with 2-space indentation
- UTF-8 encoding is used for all files
- Files are automatically created if missing during server startup

### Performance Considerations
- Profiles are loaded into memory for fast access
- Changes are immediately written to disk for persistence
- Large inventories may impact server performance
- Consider profile size when adding many items

### Backup and Recovery
- Always backup the profiles folder before making modifications
- Profile corruption can be recovered from backups
- The server can regenerate missing profiles with default data

## Common Issues and Troubleshooting

### Profile Corruption
If a profile becomes corrupted:
1. Stop the server
2. Restore from backup or delete the corrupted file
3. Restart the server (it will regenerate with defaults)

### Missing Items
Items not appearing in-game usually means:
- Incorrect `templateId` format
- Missing required attributes
- Profile not properly saved

### Revision Conflicts
If revision numbers become inconsistent:
- Check for manual file edits during server runtime
- Ensure proper file locking during modifications
- Restart the server to resynchronize

## Development Tips

### Adding New Profile Types
To add a new profile type:
1. Create the JSON file in the profiles folder
2. Add handling logic in `structure/mcp.js`
3. Implement proper initialization and validation

### Debugging Profile Issues
- Check server console for profile-related errors
- Verify JSON syntax with a validator
- Compare working profiles with problematic ones
- Use server logging to trace profile operations

This documentation provides a comprehensive overview of the profiles folder structure and functionality in LawinServer. For specific implementation details, refer to the source code in the `structure` folder, particularly `mcp.js` which handles most profile operations.

## See Also
- **[Profile Operations Examples](examples/profile-operations.js)** - Practical code examples demonstrating how to programmatically work with profiles
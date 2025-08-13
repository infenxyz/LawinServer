// Example: How to work with LawinServer profiles
// This file demonstrates common operations developers might perform on profiles

const fs = require('fs');
const path = require('path');

// Example 1: Adding V-Bucks to a player's account
function addVBucks(amount) {
    const profilePath = './profiles/common_core.json';
    const profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
    
    // Find the currency item
    if (profile.items.Currency) {
        profile.items.Currency.quantity += amount;
    } else {
        // Create currency item if it doesn't exist
        profile.items.Currency = {
            "templateId": "Currency:MtxPurchased",
            "attributes": { "platform": "EpicPC" },
            "quantity": amount
        };
    }
    
    // Update revision and save
    profile.rvn += 1;
    fs.writeFileSync(profilePath, JSON.stringify(profile, null, 2));
    
    console.log(`Added ${amount} V-Bucks. New total: ${profile.items.Currency.quantity}`);
}

// Example 2: Adding a cosmetic item to Battle Royale profile
function addCosmetic(templateId, itemId = null) {
    const profilePath = './profiles/athena.json';
    const profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
    
    // Generate unique ID if not provided
    if (!itemId) {
        itemId = require('uuid').v4();
    }
    
    // Add the cosmetic item
    profile.items[itemId] = {
        "templateId": templateId,
        "attributes": {
            "max_level_bonus": 0,
            "level": 1,
            "item_seen": false,
            "xp": 0,
            "favorite": false
        },
        "quantity": 1
    };
    
    // Update revision and save
    profile.rvn += 1;
    fs.writeFileSync(profilePath, JSON.stringify(profile, null, 2));
    
    console.log(`Added cosmetic: ${templateId} with ID: ${itemId}`);
}

// Example 3: Setting Support-A-Creator code
function setSupportCreatorCode(creatorCode) {
    const profilePath = './profiles/common_core.json';
    const profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
    
    // Set creator code in stats
    if (!profile.stats) profile.stats = {};
    if (!profile.stats.attributes) profile.stats.attributes = {};
    
    profile.stats.attributes.mtx_affiliate = creatorCode;
    profile.stats.attributes.mtx_affiliate_set_time = new Date().toISOString();
    
    // Update revision and save
    profile.rvn += 1;
    fs.writeFileSync(profilePath, JSON.stringify(profile, null, 2));
    
    console.log(`Set Support-A-Creator code to: ${creatorCode}`);
}

// Example 4: Adding materials to Save the World inventory
function addMaterials(materialType, quantity) {
    const profilePath = './profiles/theater0.json';
    const profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
    
    // Template mapping for common materials
    const materialTemplates = {
        'wood': 'Ingredient:ingredient_wood',
        'stone': 'Ingredient:ingredient_stone',
        'metal': 'Ingredient:ingredient_metal',
        'blastpowder': 'Ingredient:ingredient_blastpowder'
    };
    
    const templateId = materialTemplates[materialType.toLowerCase()];
    if (!templateId) {
        console.log(`Unknown material type: ${materialType}`);
        return;
    }
    
    // Find existing material or create new entry
    let existingItem = null;
    for (const [itemId, item] of Object.entries(profile.items)) {
        if (item.templateId === templateId) {
            existingItem = { id: itemId, item: item };
            break;
        }
    }
    
    if (existingItem) {
        // Add to existing quantity
        existingItem.item.quantity += quantity;
        console.log(`Added ${quantity} ${materialType}. New total: ${existingItem.item.quantity}`);
    } else {
        // Create new material entry
        const newItemId = require('uuid').v4();
        profile.items[newItemId] = {
            "templateId": templateId,
            "attributes": {
                "loadedAmmo": 0,
                "inventory_overflow_date": false,
                "level": 0,
                "alterationDefinitions": [],
                "durability": 1,
                "itemSource": ""
            },
            "quantity": quantity
        };
        console.log(`Added ${quantity} ${materialType} as new item.`);
    }
    
    // Update revision and save
    profile.rvn += 1;
    fs.writeFileSync(profilePath, JSON.stringify(profile, null, 2));
}

// Example 5: Reading player statistics
function getPlayerStats() {
    const profiles = ['common_core', 'athena', 'theater0'];
    const stats = {};
    
    profiles.forEach(profileName => {
        const profilePath = `./profiles/${profileName}.json`;
        if (fs.existsSync(profilePath)) {
            const profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
            stats[profileName] = {
                revision: profile.rvn,
                itemCount: Object.keys(profile.items || {}).length,
                attributes: profile.stats?.attributes || {}
            };
        }
    });
    
    return stats;
}

// Example usage (commented out to prevent accidental execution):
/*
// Add 1000 V-Bucks
addVBucks(1000);

// Add a skin
addCosmetic('AthenaCharacter:cid_001_athena_commando_f_default');

// Set creator code
setSupportCreatorCode('LAWIN');

// Add 500 wood to STW inventory
addMaterials('wood', 500);

// Get player statistics
console.log('Player Stats:', getPlayerStats());
*/

module.exports = {
    addVBucks,
    addCosmetic,
    setSupportCreatorCode,
    addMaterials,
    getPlayerStats
};
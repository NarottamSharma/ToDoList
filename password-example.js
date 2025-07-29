const bcrypt = require('bcrypt');

// Demonstration of bcrypt hashing and salting
async function demonstrateBcrypt() {
    const password = "mySecretPassword123";
    
    console.log("=== BCRYPT DEMONSTRATION ===\n");
    
    // 1. Hashing with different cost factors
    console.log("1. HASHING WITH DIFFERENT COST FACTORS:");
    
    for (let cost = 10; cost <= 12; cost++) {
        const startTime = Date.now();
        const hash = await bcrypt.hash(password, cost);
        const endTime = Date.now();
        
        console.log(`Cost ${cost}: ${hash}`);
        console.log(`Time taken: ${endTime - startTime}ms\n`);
    }
    
    // 2. Same password, different salts
    console.log("2. SAME PASSWORD, DIFFERENT SALTS:");
    for (let i = 1; i <= 3; i++) {
        const hash = await bcrypt.hash(password, 12);
        console.log(`Hash ${i}: ${hash}`);
    }
    
    // 3. Password verification
    console.log("\n3. PASSWORD VERIFICATION:");
    const storedHash = await bcrypt.hash(password, 12);
    console.log(`Stored hash: ${storedHash}`);
    
    const correctPassword = await bcrypt.compare(password, storedHash);
    const wrongPassword = await bcrypt.compare("wrongPassword", storedHash);
    
    console.log(`Correct password ("${password}"): ${correctPassword}`);
    console.log(`Wrong password ("wrongPassword"): ${wrongPassword}`);
    
    // 4. Breaking down the hash
    console.log("\n4. HASH BREAKDOWN:");
    console.log(`Full hash: ${storedHash}`);
    console.log(`Algorithm: ${storedHash.substring(0, 4)}`);
    console.log(`Cost: ${storedHash.substring(4, 6)}`);
    console.log(`Salt: ${storedHash.substring(7, 29)}`);
    console.log(`Hash: ${storedHash.substring(29)}`);
}

// Security comparison
function securityComparison() {
    console.log("\n=== SECURITY COMPARISON ===\n");
    
    console.log("❌ INSECURE (Plain text):");
    console.log("Database: { password: 'mySecretPassword123' }");
    console.log("Risk: Anyone with database access sees passwords\n");
    
    console.log("⚠️  WEAK (Simple hash):");
    console.log("Database: { password: 'sha256hash...' }");
    console.log("Risk: Rainbow table attacks, no salt\n");
    
    console.log("✅ SECURE (bcrypt with salt):");
    console.log("Database: { password: '$2b$12$LQv3c1yq...' }");
    console.log("Benefits:");
    console.log("- Unique salt per password");
    console.log("- Slow hashing prevents brute force");
    console.log("- Industry standard");
    console.log("- Future-proof (adjustable cost)");
}

// Attack scenarios
function attackScenarios() {
    console.log("\n=== ATTACK SCENARIOS ===\n");
    
    console.log("🏴‍☠️ RAINBOW TABLE ATTACK:");
    console.log("Attacker has precomputed hash dictionary");
    console.log("Without salt: password123 → always same hash");
    console.log("With salt: password123 + unique salt → unique hash");
    console.log("Result: Salt defeats rainbow tables ✅\n");
    
    console.log("⚡ BRUTE FORCE ATTACK:");
    console.log("MD5: 1 billion hashes/second");
    console.log("bcrypt cost 12: ~4,000 hashes/second");
    console.log("Time to crack 8-char password:");
    console.log("- MD5: ~2 hours");
    console.log("- bcrypt: ~200 years ✅");
}

// Run demonstrations
if (require.main === module) {
    demonstrateBcrypt()
        .then(() => securityComparison())
        .then(() => attackScenarios())
        .catch(console.error);
}

module.exports = { demonstrateBcrypt, securityComparison, attackScenarios };

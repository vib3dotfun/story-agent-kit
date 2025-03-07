import { testNativeApp } from './apps/native';
import 'dotenv/config';

/**
 * Run all tests or specific app tests based on command line arguments
 */
async function runTests() {
    // Get command line arguments
    const args = process.argv.slice(2);

    // If no specific app is specified, run all tests
    if (args.length === 0) {
        console.log('Running all tests...\n');
        await testNativeApp();
        console.log('\nAll tests completed!');
        return;
    }

    // Run tests for specific apps
    for (const app of args) {
        switch (app.toLowerCase()) {
            case 'native':
                await testNativeApp();
                break;
            default:
                console.error(`Unknown app: ${app}`);
                console.log('Available apps: native');
                process.exit(1);
        }
    }

    console.log('\nSpecified tests completed!');
}

// Run the tests
runTests().catch(error => {
    console.error('Error running tests:', error);
    process.exit(1);
});
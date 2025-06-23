const { seedDatabase } = require("./seedData");

/**
 * Скрипт для запуску наповнення бази даних
 */
async function runSeed() {
  try {
    await seedDatabase();
    console.log("Скрипт наповнення бази даних виконано успішно!");
    process.exit(0);
  } catch (error) {
    console.error("Помилка при виконанні скрипта наповнення:", error);
    process.exit(1);
  }
}

// Запускаємо скрипт
runSeed();

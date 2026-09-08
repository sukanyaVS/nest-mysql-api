-- Use a temporary default so existing users receive a value, then remove it so
-- future rows must provide a password explicitly.
ALTER TABLE `User` ADD COLUMN `password` VARCHAR(191) NOT NULL DEFAULT '';
ALTER TABLE `User` MODIFY COLUMN `password` VARCHAR(191) NOT NULL;

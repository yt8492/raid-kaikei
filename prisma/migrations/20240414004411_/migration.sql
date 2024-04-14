-- DropIndex
DROP INDEX `EventPayment_eventId_fkey` ON `EventPayment`;

-- DropIndex
DROP INDEX `UserEvent_eventId_fkey` ON `UserEvent`;

-- AddForeignKey
ALTER TABLE `UserEvent` ADD CONSTRAINT `UserEvent_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventPayment` ADD CONSTRAINT `EventPayment_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

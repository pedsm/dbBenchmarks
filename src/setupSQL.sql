CREATE TABLE `companies`.`companies` (
  `id` INT NOT NULL,
  `name` VARCHAR(45) NULL,
  `catchPhrase` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC));

CREATE TABLE `companies`.`people` (
  `id` INT NOT NULL,
  `firstName` VARCHAR(45) NULL,
  `lastName` VARCHAR(45) NULL,
  `phone` VARCHAR(45) NULL,
  `age` INT NULL,
  `company` INT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  INDEX `workingAt_idx` (`company` ASC),
  CONSTRAINT `workingAt`
    FOREIGN KEY (`company`)
    REFERENCES `companies`.`companies` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE `companies`.`friendships` (
  `friendshipId` INT NOT NULL,
  `aId` INT NOT NULL,
  `bId` INT NOT NULL,
  PRIMARY KEY (`friendshipId`),
  INDEX `friendA_idx` (`aId` ASC),
  INDEX `friendB_idx` (`bId` ASC),
  CONSTRAINT `friendA`
    FOREIGN KEY (`aId`)
    REFERENCES `companies`.`people` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `friendB`
    FOREIGN KEY (`bId`)
    REFERENCES `companies`.`people` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


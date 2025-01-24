/*
 Navicat Premium Dump SQL

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 80019 (8.0.19)
 Source Host           : localhost:3306
 Source Schema         : attack_db

 Target Server Type    : MySQL
 Target Server Version : 80019 (8.0.19)
 File Encoding         : 65001

 Date: 04/01/2025 17:47:05
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for project_list
-- ----------------------------
DROP TABLE IF EXISTS `project_list`;
CREATE TABLE `project_list`  (
  `project_id` int NOT NULL AUTO_INCREMENT COMMENT '项目默认自增id值',
  `project_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '项目名称',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `document_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '文件名称',
  PRIMARY KEY (`project_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of project_list
-- ----------------------------

-- ----------------------------
-- Table structure for result_history
-- ----------------------------
DROP TABLE IF EXISTS `result_history`;
CREATE TABLE `result_history`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '每条结果唯一的ID值',
  `target1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '指标1',
  `target2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '指标2',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of result_history
-- ----------------------------

-- ----------------------------
-- Table structure for user_info
-- ----------------------------
DROP TABLE IF EXISTS `user_info`;
CREATE TABLE `user_info`  (
  `user_id` int NOT NULL COMMENT '关联认证表的外键',
  `username` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '用户名',
  `gender` tinyint NOT NULL DEFAULT 0 COMMENT '性别（0=未指定, 1=男, 2=女）',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '头像URL',
  `phone` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '手机号',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '邮箱',
  PRIMARY KEY (`user_id`) USING BTREE,
  INDEX `username`(`username` ASC) USING BTREE,
  CONSTRAINT `user_info_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_login` (`user_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `user_info_ibfk_2` FOREIGN KEY (`username`) REFERENCES `user_login` (`username`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_info
-- ----------------------------
INSERT INTO `user_info` VALUES (2, '测试一', 0, NULL, NULL, '2024-12-13 18:08:59', '2024-12-13 18:08:59', NULL);
INSERT INTO `user_info` VALUES (3, '测试二', 0, 'https://ctbu-cqt.oss-cn-chengdu.aliyuncs.com/avatars/1731250219719.png', NULL, '2024-12-26 16:01:33', '2024-12-26 20:51:49', NULL);
INSERT INTO `user_info` VALUES (4, '测试账号1', 0, NULL, NULL, '2025-01-04 14:31:47', '2025-01-04 14:31:47', NULL);
INSERT INTO `user_info` VALUES (5, '测试账号2', 0, NULL, NULL, '2025-01-04 14:36:24', '2025-01-04 14:36:24', NULL);
INSERT INTO `user_info` VALUES (6, '测试账号3', 0, NULL, NULL, '2025-01-04 14:48:06', '2025-01-04 14:48:06', NULL);

-- ----------------------------
-- Table structure for user_login
-- ----------------------------
DROP TABLE IF EXISTS `user_login`;
CREATE TABLE `user_login`  (
  `user_id` int NOT NULL AUTO_INCREMENT COMMENT '认证ID',
  `username` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户名',
  `password_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '密码哈希值',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '账号创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间',
  PRIMARY KEY (`user_id`) USING BTREE,
  UNIQUE INDEX `unique_username`(`username` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_login
-- ----------------------------
INSERT INTO `user_login` VALUES (2, '测试一', '$2b$10$lI6SE.6FuQ6aacSiVuw4tuJpzpzGG2ULy91aFQsM6W2CIlIGk.KRi', '2024-12-13 18:08:59', '2024-12-13 18:08:59');
INSERT INTO `user_login` VALUES (3, '测试二', '$2b$10$pWeXUlMjX9pMZZgjBFX5teZtjIWYsQAimzK0BYdCl3.iIc4KMnkIO', '2024-12-26 16:01:33', '2024-12-26 16:01:33');
INSERT INTO `user_login` VALUES (4, '测试账号1', '$2b$10$GOglH4j9mW2.cUANIJ.SEuCLwh2RQFw6Jb/j6gPBeCsqVWqV9caxe', '2025-01-04 14:31:47', '2025-01-04 14:31:47');
INSERT INTO `user_login` VALUES (5, '测试账号2', '$2b$10$Y23UoREmVAad.CZ45uM0U.foSxNlTpMZ/Z8Z3zJzH4537ErGX4RGi', '2025-01-04 14:36:24', '2025-01-04 14:36:24');
INSERT INTO `user_login` VALUES (6, '测试账号3', '$2b$10$J6eObdATJ59wb61iBrTDcuwanxJEuhl6pqTN8NDonKsmqo11h0oBe', '2025-01-04 14:48:06', '2025-01-04 14:48:06');

-- ----------------------------
-- Triggers structure for table user_login
-- ----------------------------
DROP TRIGGER IF EXISTS `after_user_register_insert`;
delimiter ;;
CREATE TRIGGER `after_user_register_insert` AFTER INSERT ON `user_login` FOR EACH ROW BEGIN
  -- 插入到 user_info 中，并将 username 设置为 username
  INSERT INTO `user_info` (user_id, username)
  VALUES (NEW.user_id, NEW.username);
END
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;

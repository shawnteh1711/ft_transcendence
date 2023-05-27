"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const achievement_entity_1 = require("./achievement.entity");
const channel_entity_1 = require("./channel.entity");
const channel_user_entity_1 = require("./channel_user.entity");
const friends_entity_1 = require("./friends.entity");
const match_history_entity_1 = require("./match_history.entity");
const message_entity_1 = require("./message.entity");
const stats_entity_1 = require("./stats.entity");
const user_entity_1 = require("./user.entity");
const user_achievement_entity_1 = require("./user_achievement.entity");
const entities = [
    user_entity_1.User,
    match_history_entity_1.MatchHistory,
    stats_entity_1.Stat,
    user_achievement_entity_1.UserAchievement,
    achievement_entity_1.Achievement,
    friends_entity_1.Friend,
    channel_entity_1.Channel,
    channel_user_entity_1.ChannelUser,
    message_entity_1.Message,
];
exports.default = entities;
//# sourceMappingURL=index.js.map
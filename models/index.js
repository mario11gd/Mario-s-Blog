const Sequelize = require("sequelize");

const url = process.env.DATABASE_URL || "sqlite:blog.sqlite";

const sequelize = new Sequelize(url);

const Posts = require('./post.js')(sequelize);
const Attachments = require('./attachment.js')(sequelize);

Attachments.hasOne(Posts, {
    as: "Post",
    foreignKey: "attachmentId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

Posts.belongsTo(Attachments, { 
    as: "Attachment",
    foreignKey: 'attachmentId',
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

module.exports = sequelize;

/**
 * kintone api - nodejs client
 */

const text = new WeakMap();
const mentions = new WeakMap();

/**
 * CommentContent model
 */
class CommentContent {
  /**
     * constructor
     * @param {String} textInput
     * @param {Array<mentions>} mentionsInput
     */
  constructor(textInput, mentionsInput) {
    text.set(this, textInput);
    mentions.set(this, mentionsInput);
  }
  /**
     * Get JSON struct of this model
     * @return {integer}
     */
  toJSON() {
    const data = {
      text: text.get(this),
      mentions: [],
    };
    const mentionsArray = mentions.get(this);
    if (mentionsArray.length > 0 && mentionsArray[0].toJSON) {
      mentionsArray.forEach((mention) => {
        data.mentions.push(mention.toJSON());
      });
    } else {
      data.mentions = mentionsArray || [];
    }
    return data;
  }
  /**
     * Convert this model to JSON string
     * @return {String}
     */
  toJSONString() {
    return JSON.stringify(this.toJSON());
  }
}
module.exports = CommentContent;

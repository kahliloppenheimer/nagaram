// Word helper object performs any tasks related related to the
// validation of words for a particular game
module.exports.inDict = function(word) {
    return true;
}

// Returns true iff the small word can be spelled by using
// any subset of characters from the big word
module.exports.canBuildFrom = function(bigWord, smallWord) {
    // Maps each character to how many times it appears
    chars = {};
    for(var i = 0, len = bigWord.length; i < len; ++i) {
        nextChar = bigWord[i];
        chars[nextChar] = (chars[nextChar] + 1) || 1;
    }
    // Checks to see if smallWord matches
    for(var i = 0, len = smallWord.length; i < len; ++i) {
        nextChar = smallWord[i];
        if(!chars[nextChar] || chars[nextChar] === 0) {
            return false;
        }
        --chars[nextChar];
    }
}

// Returns a random word from the dictionary
module.exports.getRandWord = function() {
    return "nagaram";
}

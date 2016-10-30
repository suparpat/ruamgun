function unixTimeSince(days){
	var now = Math.floor(new Date() / 1000);
	return now - (60 * 60 * 24 * days);
}

module.exports = {
	unixTimeSince: unixTimeSince
}
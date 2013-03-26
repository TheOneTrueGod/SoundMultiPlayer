var Sounds = {}
Sounds.Initialize = function Initialize() {
	this.sounds = {}
	this.sounds["Ding1"] = {source:"sounds/Ding1.wav", audioObjects:[], volume:.9, startAt:0, maxCopies: 5}
	this.sounds["Ding2"] = {source:"sounds/Ding2.wav", audioObjects:[], volume:.9, startAt:0, maxCopies: 5}
	this.sounds["Ding3"] = {source:"sounds/Ding3.wav", audioObjects:[], volume:.9, startAt:0, maxCopies: 5}
	this.sounds["Wood2"] = {source:"sounds/Wood2.wav", audioObjects:[], volume:.2, startAt:0, maxCopies: 5}
	this.sounds["Flipper"] = {source:"sounds/FlipperUp7.wav", audioObjects:[], volume:.6, startAt:0, maxCopies: 2}
	this.sounds["LifeLoss"] = {source:"sounds/Drain2.wav", audioObjects:[], volume:.4, startAt:0, maxCopies: 1}
	this.sounds["Launch"] = {source:"sounds/BallRoll1.wav", audioObjects:[], volume:.4, startAt:0, maxCopies: 1}
	this.sounds["TopLanes"] = {source:"sounds/Bumper16.wav", audioObjects:[], volume:.7, startAt:0, maxCopies: 1}
	this.sounds["Woosh"] = {source:"sounds/Woosh1.wav", audioObjects:[], volume:.3, startAt:0, maxCopies: 1}
	this.sounds["Metal"] = {source:"sounds/Bumper16.wav", audioObjects:[], volume:.9, startAt:0, maxCopies: 1}
}

Sounds.PlaySound = function PlaySound(soundKey) {
	if (this.sounds.hasOwnProperty(soundKey))
	{
		var highestPlayTime = 0;
		for (var i = 0; i < this.sounds[soundKey].audioObjects.length; i++)
		{
			if (this.sounds[soundKey].audioObjects[i].paused)
			{
				this.sounds[soundKey].audioObjects[i].play();
				break;
			}
			else
			{
				if (this.sounds[soundKey].audioObjects[i].currentTime > this.sounds[soundKey].audioObjects[highestPlayTime].currentTime)
				{
					highestPlayTime = i;
				}
			}
		}
		if (i == this.sounds[soundKey].audioObjects.length)
		{
			if (i < this.sounds[soundKey].maxCopies)
			{
				this.sounds[soundKey].audioObjects.push(new Audio(this.sounds[soundKey].source));
				this.sounds[soundKey].audioObjects[i].volume = this.sounds[soundKey].volume;
				this.sounds[soundKey].audioObjects[i].play();
			}
			else
			{
				this.sounds[soundKey].audioObjects[highestPlayTime].play();
			}
		}
	}
}
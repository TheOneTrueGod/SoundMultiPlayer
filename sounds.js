// TO USE:
// Modify the Sounds.Initialize function to load whatever sounds you want it to load.
// Call Sounds.Initialize() somewhere in your program where it makes sense
// use Sounds.playSound(KEY); to play any given sound

// Other Methods:
// Sounds.StartMusic(musicKey) -- Loops a sound effect and sets it as the current background music.
// Sounds.FadeOutMusic(duration, callback) -- fades out the current background music over time.  Callback is called as soon as the sound stops playing.
// Sounds.FadeInMusic(duration, callback) -- fades in the current background music.  If StartMusic hasn't been called, this function won't really do a whole lot
// Sounds.LoadSound(soundData) -- used to load a sound.  See Sounds.Initialize for examples and comments.
// Sounds.StopSound(soundKey) -- stops a sound.
var Sounds = {}
Sounds.Initialize = function Initialize() {
	this.soundMuted = false;
	this.musicMuted = false;
	this.fadingTimeout = null;
	this.fadingDuration = 20;
	this.fadingTimer = 0;
	this.backgroundVolume = 0;
	this.volumeAtStartOfFade = 0;
	this.fadeOverrideable = true;
	this.sounds = {}
	
	// These are what you need to modify.
	// key is the soundKey that you'll be referring to the sound as when you play it.
	// source is the url of the sound
	// volume is the percent of the original volume you want to play it at
	// maxCopies is the maximum number of copies of the sound that can be playing at once.
	this.LoadSound({key:'Ding1', source:'sounds/Ding1', volume:.9, maxCopies:5});
	this.LoadSound({key:'Ding2', source:'sounds/Ding2', volume:.9, maxCopies:5});
	this.LoadSound({key:'Ding3', source:'sounds/Ding3', volume:.9, maxCopies:5});
	this.LoadSound({key:'Wood2', source:'sounds/Wood2', volume:.5, maxCopies:5});
	this.LoadSound({key:'Flipper', source:'sounds/FlipperUp7', volume:.6, maxCopies:2});
	this.LoadSound({key:'LifeLoss', source:'sounds/Drain2', volume:.4, maxCopies:1});
	this.LoadSound({key:'Launch', source:'sounds/BallRoll1', volume:.4, maxCopies:1});
	this.LoadSound({key:'TopLanes', source:'sounds/Bumper16', volume:.7, maxCopies:1});
	this.LoadSound({key:'Woosh', source:'sounds/Woosh1', volume:.3, maxCopies:1});
	this.LoadSound({key:'Metal', source:'sounds/Bumper16', volume:.9, maxCopies:1});
	this.LoadSound({key:'Siren', source:'sounds/Siren1', volume:.9, maxCopies:1});
	
	this.LoadSound({key:'BGMusic', source:'sounds/Underture_Edit_1', volume:.6, maxCopies:1});
	this.LoadSound({key:'EndGameMusic', source:'sounds/PinballEdit3', volume:.4, maxCopies:1});

	Sounds.StartMusic = function StartMusic(musicKey) {
		this.sounds.backgroundMusic = new Audio(this.sounds[musicKey].source);
		Sounds.backgroundVolume = this.sounds[musicKey].volume;
		if (this.musicMuted) {
			this.sounds.backgroundMusic.volume = 0;
		}
		else {
			this.sounds.backgroundMusic.volume = Sounds.backgroundVolume;
		}
		this.sounds.backgroundMusic.addEventListener('ended', function() {
			this.currentTime = 0;
			this.play();
		}, false);
		this.sounds.backgroundMusic.volume = 0;
		try { this.sounds.backgroundMusic.currentTime = 0; } catch(err) { }
		this.sounds.backgroundMusic.play();
		if (!this.musicMuted) { this.FadeInMusic(5); }
	}

	Sounds.FadeOutMusic = function FadeOutBackgroundMusic(duration, callback) {
		if (!Sounds.fadeOverrideable) { return false; }
		Sounds.fadingTimer = 0;
		Sounds.volumeAtStartOfFade = Sounds.sounds.backgroundMusic.volume;
		Sounds.fadingDuration = duration;
		if (Sounds.fadingTimeout) { 
			clearTimeout(Sounds.fadingTimeout); 
		}

		function FadeMusicDown() {
			Sounds.fadingTimer += 1;
			var volumePct = 1 - (Sounds.fadingTimer / Sounds.fadingDuration);
			Sounds.sounds.backgroundMusic.volume = volumePct * Sounds.volumeAtStartOfFade;
			
			if (Sounds.fadingTimer >= Sounds.fadingDuration)
			{
				Sounds.fadingTimeout = null;
				Sounds.fadingTimer = 0;
				if (callback)
				{
					callback();
				}
			}
			else
			{
				Sounds.fadingTimeout = window.setTimeout(FadeMusicDown, 100);
			}
		}
		
		Sounds.fadingTimeout = window.setTimeout(FadeMusicDown, 100);
	}

	Sounds.FadeInMusic = function FadeOutBackgroundMusic(duration, callback) {
		if (!Sounds.fadeOverrideable || Sounds.musicMuted) { return false; }
		Sounds.fadingTimer = 0;
		Sounds.volumeAtStartOfFade = Sounds.sounds.backgroundMusic.volume;
		Sounds.fadingDuration = duration;
		if (Sounds.fadingTimeout) { 
			clearTimeout(Sounds.fadingTimeout); 
		}
		
		function FadeMusicUp() {
			Sounds.fadingTimer += 1;
			var volumePct = (Sounds.fadingTimer / Sounds.fadingDuration);
			Sounds.sounds.backgroundMusic.volume = volumePct * (Sounds.backgroundVolume - Sounds.volumeAtStartOfFade) + Sounds.volumeAtStartOfFade;
			
			if (Sounds.fadingTimer >= Sounds.fadingDuration)
			{
				Sounds.fadingTimeout = null;
				Sounds.fadingTimer = 0;
				if (callback)
				{
					callback();
				}
			}
			else
			{
				Sounds.fadingTimeout = window.setTimeout(FadeMusicUp, 100);
			}
		}
		
		Sounds.fadingTimeout = window.setTimeout(FadeMusicUp, 100);
	}

	var audioFeatureChecker = new Audio();
	Sounds.LoadSound = function LoadSound(soundData) {
		if (!soundData.hasOwnProperty('source') || !soundData.hasOwnProperty('key'))
		{
			return;
		}
		var source = '';
		if (audioFeatureChecker.canPlayType('audio/mpeg;')) {
			source = soundData.source + '.mp3';
		} else {
			source = soundData.source + '.ogg';
		}
		var audioObject = {source: source, audioObjects:[], volume:1, maxCopies: 5};
		if (soundData.hasOwnProperty("volume")) { audioObject.volume = soundData.volume; }
		if (soundData.hasOwnProperty("maxCopies")) { audioObject.maxCopies = soundData.maxCopies; }
		
		this.sounds[soundData.key] = audioObject;
	}

	Sounds.PlaySound = function PlaySound(soundKey) {
		if (this.soundMuted) { return; }
		if (this.sounds.hasOwnProperty(soundKey))
		{
			var highestPlayTime = 0;
			for (var i = 0; i < this.sounds[soundKey].audioObjects.length; i++)
			{
				if (this.sounds[soundKey].audioObjects[i].paused)
				{
					try { this.sounds[soundKey].audioObjects[i].currentTime = 0; } catch(err) { }
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
					try { this.sounds[soundKey].audioObjects[highestPlayTime].currentTime = 0; } catch(err) { }
					this.sounds[soundKey].audioObjects[highestPlayTime].play();
				}
			}
		}
	}

	Sounds.StopSound = function stopSound(soundKey) {
		if (this.sounds.hasOwnProperty(soundKey))
		{
			for (var i = 0; i < this.sounds[soundKey].audioObjects.length; i++)
			{
				this.sounds[soundKey].audioObjects[i].paused = true;
			}
		}
	}
}
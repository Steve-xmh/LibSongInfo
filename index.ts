/// <reference types="./types/global" />

const cachedFunctionMap: Map<string, Function> = new Map();

// rome-ignore lint/suspicious/noExplicitAny: 函数类型可随意
export function callCachedSearchFunction<F extends (...args: any[]) => any>(
	searchFunctionName: string | ((func: Function) => boolean),
	args: Parameters<F>,
): ReturnType<F> {
	if (!cachedFunctionMap.has(searchFunctionName.toString())) {
		const findResult = betterncm.ncm.findApiFunction(searchFunctionName);
		if (findResult) {
			const [func, funcRoot] = findResult;
			cachedFunctionMap.set(searchFunctionName.toString(), func.bind(funcRoot));
		}
	}
	const cachedFunc = cachedFunctionMap.get(searchFunctionName.toString());
	if (cachedFunc) {
		return cachedFunc.apply(null, args);
	} else {
		throw new TypeError(`函数 ${searchFunctionName.toString()} 未找到`);
	}
}

/**
 * 获取当前正在播放的歌曲的信息，包括歌曲信息，来源，当前播放状态等
 * @todo 补全返回值类型
 * @returns 当前歌曲的播放信息
 */
function getPlayingSong() {
	if (APP_CONF.isOSX) {
		return callCachedSearchFunction("baJ", []);
	} else {
		return callCachedSearchFunction("getPlaying", []);
	}
}

enum PlayState {
	Playing = 1,
	Pausing = 2,
}

interface AudioLoadInfo {
	activeCode: number;
	code: number;
	duration: number; // 单位秒
	errorCode: number;
	errorString: number;
}

interface AudioEndInfo {
	code: number;
	from: string; // switch
}

plugin.onLoad((injectPlugin) => {
	const plugin = injectPlugin.mainPlugin;
	plugin.trackPlaying = getPlayingSong();
	plugin.autioId = "";
	plugin.playState = PlayState.Pausing;
	plugin.duration = -1;
	plugin.loadProgress = 0;
	plugin.playProgress = 0;
	plugin.getPlaying = () => getPlayingSong();
	plugin.getMusicId = () =>
		plugin.trackPlaying?.originFromTrack?.lrcid ||
		plugin.trackPlaying?.originFromTrack?.track?.tid ||
		plugin.trackPlaying?.data?.id ||
		0;

	const setAudioId = (audioId: string) => {
		if (audioId !== plugin.autioId) {
			plugin.autioId = audioId;
			plugin.dispatchEvent(new Event("audio-id-updated"));
		}
	};

	const setDuration = (duration: number) => {
		if (duration !== plugin.duration) {
			plugin.duration = duration;
			plugin.dispatchEvent(new Event("duration-updated"));
		}
	};

	const setPlayState = (playState: PlayState) => {
		if (playState !== plugin.playState) {
			plugin.playState = playState;
			plugin.dispatchEvent(new Event("play-state-updated"));
		}
	};

	const setLoadProgress = (loadProgress: number) => {
		if (loadProgress !== plugin.loadProgress) {
			plugin.loadProgress = loadProgress;
			plugin.dispatchEvent(new Event("load-progress-updated"));
		}
	};

	const setPlayProgress = (playProgress: number) => {
		if (playProgress !== plugin.playProgress) {
			plugin.playProgress = playProgress;
			plugin.dispatchEvent(new Event("play-progress-updated"));
		}
	};

	const onPlayProgress = (
		audioId: string,
		progress: number,
		loadProgress: number, // 当前音乐加载进度 [0.0-1.0] 1 为加载完成
	) => {
		setAudioId(audioId);
		setLoadProgress(loadProgress);
		setPlayProgress(progress);
	};

	const refreshTrackPlaying = () => {
		const nowPlaying = getPlayingSong();
		if (nowPlaying !== plugin.trackPlaying) {
			plugin.trackPlaying = nowPlaying;
			plugin.dispatchEvent(new Event("playing-updated"));
		}
	};

	const onLoad = (audioId: string, info: AudioLoadInfo) => {
		const duration = info?.duration;
		if (duration) {
			setDuration((duration * 1000) | 0);
		} else {
			setDuration(-1);
		}
		refreshTrackPlaying();
		setAudioId(audioId);
	};

	const onEnd = (audioId: string, _info: AudioEndInfo) => {
		setAudioId(audioId);
		refreshTrackPlaying();
		setTimeout(() => {
			setAudioId(plugin.getMusicId().toString());
		}, 200);
	};

	const onPlayStateChange = (
		audioId: string,
		stateId: string,
		loadProgress: number,
	) => {
		setAudioId(audioId);
		setLoadProgress(loadProgress);
		const state = stateId.split("|")[1];
		if (state === "pause") {
			setPlayState(PlayState.Pausing);
		} else if (state === "resume") {
			setPlayState(PlayState.Playing);
		}
	};

	window.addEventListener(
		"load",
		() => {
			plugin.trackPlaying = plugin.getPlaying();
		},
		{
			once: true,
		},
	);

	legacyNativeCmder.appendRegisterCall(
		"PlayProgress",
		"audioplayer",
		onPlayProgress,
	);
	legacyNativeCmder.appendRegisterCall(
		"PlayState",
		"audioplayer",
		onPlayStateChange,
	);
	legacyNativeCmder.appendRegisterCall("Load", "audioplayer", onLoad);
	legacyNativeCmder.appendRegisterCall("End", "audioplayer", onEnd);
});

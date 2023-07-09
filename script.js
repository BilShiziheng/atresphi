import simphi from './js/simphi.js';
import { audio } from './utils/aup.js';
import { full, Timer, getConstructorName, urls, isUndefined, loadJS, frameTimer, time2Str, orientation, FrameAnimater } from './js/common.js';
import { uploader, readZip } from './js/reader.js';
import { InteractProxy } from './utils/interact.js';
import { brain } from './js/tips.js';
self._i = ['Aterstar Phi\x67ros模拟器', [1, 1, 0, '072'], 1621795955, 1680614770];
const userAgent = navigator.userAgent;
const tween = {
	easeInSine: pos => 1 - Math.cos(pos * Math.PI / 2),
	easeOutSine: pos => Math.sin(pos * Math.PI / 2),
	easeOutCubic: pos => 1 + (pos - 1) ** 3,
	easeIOCubic: pos => ((pos *= 2) < 1 ? pos ** 3 : ((pos - 2) ** 3 + 2)) / 2,
	easeInCubic: pos => pos ** 3, //9
	ease10: pos => 1 - (pos - 1) ** 4, //10
	ease15: pos => pos ** 5 //15
}
function range(num) {
	if (num < 0) return 0;
	if (num > 1) return 1;
	return num;
}
// 指定日期，这里是2022年1月1日
const specifiedDate = new Date('2023-04-08');

// 当前日期
const currentDate = new Date();

// 计算距离指定日期过去的毫秒数
const timeDiff = currentDate.getTime() - specifiedDate.getTime();

// 将毫秒数转换为天数
const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
let platform = '';
if (/Windows/i.test(userAgent)) {
  platform = 'Windows';
} else if (/Macintosh|Mac/i.test(userAgent)) {
  platform = 'Mac OS';
} else if (/iPhone|iPad|iPod/i.test(userAgent)) {
  platform = 'iOS';
} else if (/Android/i.test(userAgent)) {
  platform = 'Android';
} else {
  platform = 'Idontdao';
}

const $id = query => document.getElementById(query);
const $ = query => document.body.querySelector(query);
const $$ = query => document.body.querySelectorAll(query);
const main = {};
main.uploaded = false; //qwq
main.modify = a => a;
main.pressTime = 0;
main.kfcFkXqsVw50 = [];
main['flag{qwq}'] = () => {};
document.oncontextmenu = e => e.preventDefault(); //qwq
for (const i of $id('view-nav').children) {
	i.addEventListener('click', function() {
		for (const i of $id('view-nav').children) i.classList.toggle('active', i === this);
		if (!$id('view-doc').src) $id('view-doc').src = 'docs/use.html'; //防止阻塞页面
		$id('view-doc').classList.toggle('hide', this.id !== 'nav-use');
		$id('view-cfg').classList.toggle('hide', this.id !== 'nav-cfg');
		$id('view-msg').classList.toggle('hide', this.id !== 'nav-msg');
	});
}
$id('cover-dark').addEventListener('click', () => {
	$id('cover-dark').classList.add('fade');
	$id('cover-view').classList.add('fade');
});
$id('qwq').addEventListener('click', () => {
	$id('cover-dark').classList.remove('fade');
	$id('cover-view').classList.remove('fade');
	$id('nav-use').click();
});
$id('btn-more').addEventListener('click', () => {
	$id('cover-dark').classList.remove('fade');
	$id('cover-view').classList.remove('fade');
	$id('nav-cfg').click();
});
$id('msg-out').addEventListener('click', () => {
	$id('cover-dark').classList.remove('fade');
	$id('cover-view').classList.remove('fade');
	$id('nav-msg').click();
});
const msgHandler = {
	nodeText: $id('msg-out'),
	nodeView: $id('view-msg'),
	lastMessage: '',
	msgbox(msg, type, fatal) {
		const msgbox = document.createElement('div');
		msgbox.innerHTML = msg;
		msgbox.setAttribute('type', type);
		msgbox.classList.add('msgbox');
		const btn = document.createElement('a');
		btn.innerText = '忽略';
		btn.style.float = 'right';
		btn.onclick = () => {
			msgbox.remove();
			this.sendMessage(this.lastMessage);
		}
		if (fatal) btn.classList.add('disabled');
		msgbox.appendChild(btn);
		this.nodeView.appendChild(msgbox);
	},
	sendMessage(msg, type) {
		const num = this.nodeView.querySelectorAll('.msgbox[type=warn]').length;
		if (type === 'error') {
			this.nodeText.className = 'error';
			this.nodeText.innerText = msg;
		} else {
			this.nodeText.className = num ? 'warning' : 'accept';
			this.nodeText.innerText = msg + (num ? `（发现${num}个问题，点击查看）` : '');
			this.lastMessage = msg;
		}
	},
	sendWarning(msg, isHTML) {
		const msgText = isHTML ? msg : Utils.escapeHTML(msg);
		this.msgbox(msgText, 'warn');
		this.sendMessage(this.lastMessage);
	},
	sendError(msg, html, fatal) {
		if (html) {
			const exp = /([A-Za-z][A-Za-z+-.]{2,}:\/\/|www\.)[^\s\x00-\x20\x7f-\x9f"]{2,}[^\s\x00-\x20\x7f-\x9f"!'),.:;?\]}]/g;
			const ahtml = html.replace(exp, (match = '') => {
				const url = match.startsWith('www.') ? `//${match}` : match;
				const rpath = match.replace(`${location.origin}/`, '');
				if (match.indexOf(location.origin) > -1) return `<a href="#"style="color:#023b8f;text-decoration:underline;">${rpath}</a>`;
				return `<a href="${url}"target="_blank"style="color:#023b8f;text-decoration:underline;">${rpath}</a>`;
			});
			this.msgbox(ahtml, 'error', fatal);
		}
		this.sendMessage(msg, 'error');
		return false;
	}
}
const stat = new simphi.Stat();
const app = new simphi.Renderer($id('stage')); //test
const { canvas, ctx, canvasos, ctxos } = app;
class Emitter extends EventTarget {
	constructor(statusInit) {
		super();
		this.status = statusInit;
	}
	emit(status) {
		if (this.status === status) return;
		this.status = status;
		this.dispatchEvent(new Event('change'));
	}
	eq(status) { return this.status === status; }
	ne(status) { return this.status !== status; }
}
const emitter = new Emitter('stop');
const status2 = {
	text: '',
	list: [],
	reg(target, type, handler) {
		this.list[this.list.length] = { toString: () => handler(target) };
		target.addEventListener(type, this.update.bind(this));
	},
	update() {
		const arr = this.list.map(String).filter(Boolean);
		this.text = arr.length === 0 ? '' : `(${arr.join('+')})`;
	}
}
let levelText = '';
const bgs = new Map;
const bgsBlur = new Map;
const bgms = new Map;
const charts = new Map;
const chartsMD5 = new Map;
const chartLineData = []; //line.csv
const chartInfoData = []; //info.csv
async function checkSupport() {
	/** @param {Error} error */
	const sysError = (error, message) => {
		const type = getConstructorName(error);
		// if (message==='Script error.') return;
		let message2 = String(error);
		let detail = String(error);
		if (error instanceof Error) {
			const stack = error.stack || 'Stack not available';
			if (error.name === type) message2 = error.message;
			else message2 = `${error.name}: ${error.message}`;
			const idx = stack.indexOf(message2) + 1;
			if (idx) detail = `${message2}\n${stack.slice(idx+message2.length)}`;
			else detail = `${message2}\n    ${stack.split('\n').join('\n    ')}`; //Safari
		}
		if (message) message2 = message;
		const errMessage = `[${type}] ${message2.split('\n')[0]}`;
		const errDetail = `[${type}] ${detail}`;
		msgHandler.sendError(errMessage, Utils.escapeHTML(errDetail));
	};
	self.addEventListener('error', e => sysError(e.error, e.message));
	self.addEventListener('unhandledrejection', e => sysError(e.reason));
	const loadPlugin = async (name, urls, check) => {
		if (!check()) return true;
		const errmsg1 = `错误：${name}组件加载失败（点击查看详情）`;
		const errmsg2 = `${name}组件加载失败，请检查您的网络连接然后重试：`;
		const errmsg3 = `${name}组件加载失败，请检查浏览器兼容性`;
		msgHandler.sendMessage(`加载${name}组件...`);
		if (!await loadJS(urls).catch(e => msgHandler.sendError(errmsg1, e.message.replace(/.+/, errmsg2), true))) return false;
		if (!check()) return true;
		return msgHandler.sendError(errmsg1, errmsg3, true);
	};
	await Utils.addFont('Titillium Web', { alt: 'Custom' });
	//兼容性检测
	msgHandler.sendMessage('检查浏览器兼容性...');
	const isMobile = navigator.standalone !== undefined || navigator.platform.indexOf('Linux') > -1 && navigator.maxTouchPoints === 5;
	if (isMobile) $id('uploader-select').style.display = 'none';
	if (navigator.userAgent.indexOf('MiuiBrowser') > -1) {
		//实测 v17.1.8 问题仍然存在，v17.4.80113 问题已修复
		const version = navigator.userAgent.match(/MiuiBrowser\/(\d+\.\d+)/);
		const text = '检测到小米浏览器且版本低于17.4，可能存在切后台声音消失的问题';
		if (version && version[1] >= 17.4);
		else msgHandler.sendWarning(text);
	}
	if (!await loadPlugin('ImageBitmap兼容', urls.bitmap, () => isUndefined('createImageBitmap'))) return -1;
	if (!await loadPlugin('StackBlur', urls.blur, () => isUndefined('StackBlur'))) return -2;
	if (!await loadPlugin('md5', urls.md5, () => isUndefined('md5'))) return -3;
	msgHandler.sendMessage('加载声音组件...');
	const oggCompatible = !!(new Audio).canPlayType('audio/ogg');
	if (!await loadPlugin('ogg格式兼容', '/lib/oggmented-bundle.js', () => !oggCompatible && isUndefined('oggmented'))) return -4;
	audio.init(oggCompatible ? self.AudioContext || self.webkitAudioContext : oggmented.OggmentedAudioContext); //兼容Safari
	const orientSupported = await orientation.checkSupport();
	if (!orientSupported) {
		lockOri.checked = false;
		lockOri.container.classList.add('disabled');
		lockOri.label.textContent += '(当前设备或浏览器不支持)';
	}
}
//自动填写歌曲信息
function adjustInfo() {
	for (const i of chartInfoData) {
		if (selectchart.value.trim() === i.Chart) {
			if (i.Name) inputName.value = i.Name;
			if (i.Musician) inputArtist.value = i.Musician; //Alternative
			if (i.Composer) inputArtist.value = i.Composer; //Alternative
			if (i.Artist) inputArtist.value = i.Artist;
			if (i.Level) {
				levelText = i.Level;
				const p = levelText.toLocaleUpperCase().split('LV.').map(a => a.trim());
				if (p[0]) selectDifficulty.value = p[0];
				if (p[1]) selectLevel.value = p[1];
			}
			if (i.Illustrator) inputIllustrator.value = i.Illustrator;
			if (i.Designer) inputCharter.value = i.Designer;
			if (i.Charter) inputCharter.value = i.Charter;
			if (bgms.has(i.Music)) selectbgm.value = i.Music;
			if (bgs.has(i.Image)) {
				selectbg.value = i.Image;
				selectbg.dispatchEvent(new Event('change'));
			}
			if (isFinite(i.AspectRatio = parseFloat(i.AspectRatio))) {
				$id('select-aspect-ratio').value = i.AspectRatio;
				stage.resize(i.AspectRatio); //qwq
			}
			if (isFinite(i.ScaleRatio = parseFloat(i.ScaleRatio))) { //Legacy
				$id('select-note-scale').value = 8080 / i.ScaleRatio;
				app.setNoteScale(8080 / i.ScaleRatio);
			}
			if (isFinite(i.NoteScale = parseFloat(i.NoteScale))) {
				$id('select-note-scale').value = i.NoteScale;
				app.setNoteScale(i.NoteScale);
			}
			if (isFinite(i.GlobalAlpha = parseFloat(i.GlobalAlpha))) { //Legacy
				$id('select-background-dim').value = i.GlobalAlpha;
				app.brightness = Number(i.GlobalAlpha);
			}
			if (isFinite(i.BackgroundDim = parseFloat(i.BackgroundDim))) {
				$id('select-background-dim').value = i.BackgroundDim;
				app.brightness = Number(i.BackgroundDim);
			}
			if (isFinite(i.Offset = parseFloat(i.Offset))) inputOffset.value = i.Offset;
		}
	}
}
const stage = {
	aspectRatio: 0,
	resize(ratio) {
		if (ratio) this.aspectRatio = Number(ratio) || 16 / 9;
		const stageWidth = Math.min(854, document.documentElement.clientWidth * 0.8);
		const stageHeight = stageWidth / this.aspectRatio;
		if (app.isFull) app.stage.style.cssText = ';position:fixed;top:0;left:0;bottom:0;right:0';
		else app.stage.style.cssText = `;width:${stageWidth.toFixed()}px;height:${stageHeight.toFixed()}px`;
	}
};
stage.resize(1.777778); //qwq
self.addEventListener('resize', () => stage.resize());
//uploader
{
	let uploader_done = 0;
	let uploader_total = 0;
	$id('uploader-upload').addEventListener('click', uploader.uploadFile);
	$id('uploader-file').addEventListener('click', uploader.uploadFile);
	$id('uploader-dir').addEventListener('click', uploader.uploadDir);
	/** @type {((_:FileList) => void)} */
	uploader.onchange = e => {
		console.log(e.length);
		if (e.length) $id('uploader').classList.add('disabled');
	}
	/** @type {((_:ProgressEvent<FileReader>,_:File) => void)} */
	uploader.onprogress = function(evt, i) { //显示加载文件进度
		if (!evt.total) return;
		const percent = Math.floor(evt.loaded / evt.total * 100);
		msgHandler.sendMessage(`加载文件：${percent}% (${bytefm(evt.loaded)}/${bytefm(evt.total)})`);
	};
	/** @type {((_:ProgressEvent<FileReader>,_:File) => void)} */
	uploader.onload = function(evt, i) {
		console.log(evt);
		readZip({
			name: i.name,
			buffer: evt.target.result,
			path: i.webkitRelativePath || i.name
		}, {
			createAudioBuffer() { return audio.decode(...arguments) },
			onloadstart: () => msgHandler.sendMessage('加载zip组件...'),
			onread: handleFile,
		});
	}
	/** 
	 * @param {ReaderData} data 
	 * @param {number} total
	 */
	async function handleFile(data, total) {
		uploader_total = total;
		console.log(data);
		main.uploaded = true;
		switch (data.type) {
			case 'line':
				chartLineData.push(...data.data);
				break;
			case 'info':
				chartInfoData.push(...data.data);
				break;
			case 'media':
				bgms.set(data.name, data.data);
				selectbgm.appendChild(createOption(data.name, data.name));
				break;
			case 'audio':
				bgms.set(data.name, data.data);
				selectbgm.appendChild(createOption(data.name, data.name));
				break;
			case 'image':
				bgs.set(data.name, data.data);
				bgsBlur.set(data.name, await imgBlur(data.data));
				selectbg.appendChild(createOption(data.name, data.name));
				break;
			case 'chart':
				if (data.msg) data.msg.forEach(v => msgHandler.sendWarning(v));
				if (data.info) chartInfoData.push(data.info);
				if (data.line) chartLineData.push(...data.line);
				let basename = data.name;
				while (charts.has(basename)) basename += '\n'; //qwq
				charts.set(basename, data.data);
				chartsMD5.set(basename, data.md5);
				selectchart.appendChild(createOption(basename, data.name));
				break;
			default:
				console.error(data.data);
				msgHandler.sendWarning(`不支持的文件：${data.name}`);
		}
		msgHandler.sendMessage(`读取文件：${++uploader_done}/${uploader_total}`);
		if (uploader_done !== uploader_total) return;
		$id('uploader').classList.remove('disabled');
		adjustInfo();
		/**
		 * @param {string} innerhtml 
		 * @param {string} value 
		 */
		function createOption(value, innerhtml) {
			const option = document.createElement('option');
			const isHidden = /(^|\/)\./.test(innerhtml);
			option.innerHTML = isHidden ? '' : innerhtml;
			option.value = value;
			if (isHidden) option.classList.add('hide');
			return option;
		}
	}
}
//qwq[water,demo,democlick]
const qwq = [null, false, null, null, 0, null];
import('./js/demo.js?v=04').then(a => a.default());
//qwq end
const exitFull = () => {
	document.removeEventListener(full.onchange, exitFull);
	hitManager.clear('keyboard'); //esc退出全屏只有onchange事件能检测到
	app.isFull = full.check();
	stage.resize();
}
//hit start
const specialClick = {
	time: [0, 0, 0, 0],
	func: [() => {
		Promise.resolve().then(qwqPause);
	}, () => {
		Promise.resolve().then(qwqStop).then(qwqStop);
	}, () => {
		showStat.toggle();
	}, async () => {
		const isFull = app.isFull;
		try {
			await full.toggle();
			if (!(app.isFull = full.check())) return;
			document.addEventListener(full.onchange, exitFull);
			if (!lockOri.checked) return;
			await orientation.lockLandscape();
		} catch (e) {
			console.warn(e); //qwq
			app.isFull = !isFull;
		} finally {
			stage.resize();
		}
	}],
	click(id) {
		const now = performance.now();
		if (now - this.time[id] < 300) this.func[id]();
		this.time[id] = now;
	},
	qwq(offsetX, offsetY) {
		const { lineScale } = app;
		if (offsetX < lineScale * 1.5 && offsetY < lineScale * 1.5) this.click(0);
		if (offsetX > canvasos.width - lineScale * 1.5 && offsetY < lineScale * 1.5) this.click(1);
		if (offsetX < lineScale * 1.5 && offsetY > canvasos.height - lineScale * 1.5) this.click(2);
		if (offsetX > canvasos.width - lineScale * 1.5 && offsetY > canvasos.height - lineScale * 1.5) this.click(3);
		if (qwqEnd.second > 0) main.pressTime = main.pressTime > 0 ? -qwqEnd.second : qwqEnd.second;
	}
}
const hitManager = new simphi.HitManager();
class JudgeEvent {
	constructor(offsetX, offsetY, type, event) {
		this.offsetX = offsetX;
		this.offsetY = offsetY;
		this.type = type | 0; //1-Tap,2-Hold/Drag,3-Move
		this.judged = false; //是否被判定
		this.event = event; //flick专用回调
		this.preventBad = false; //是否阻止判定为Bad
	}
}
/**
 * 判定和音符的水平距离
 * @param {JudgeEvent} judgeEvent 
 * @param {Note} note 
 */
function getJudgeOffset(judgeEvent, note) {
	const { offsetX, offsetY } = judgeEvent;
	const { offsetX: x, offsetY: y, cosr, sinr } = note;
	return Math.abs((offsetX - x) * cosr + (offsetY - y) * sinr) || 0;
}
/**
 * 判定和音符的曼哈顿距离
 * @param {JudgeEvent} judgeEvent
 * @param {Note} note
 */
function getJudgeDistance(judgeEvent, note) {
	const { offsetX, offsetY } = judgeEvent;
	const { offsetX: x, offsetY: y, cosr, sinr } = note;
	return Math.abs((offsetX - x) * cosr + (offsetY - y) * sinr) + Math.abs((offsetX - x) * sinr - (offsetY - y) * cosr) || 0;
}
const judgeManager = {
	/**@type {JudgeEvent[]} */
	list: [],
	addEvent(notes, realTime) {
		const { list } = this;
		list.length = 0;
		if (app.playMode === 1) {
			const dispTime = Math.min(frameTimer.disp, 0.04);
			for (const i of notes) {
				if (i.scored) continue;
				const deltaTime = i.realTime - realTime;
				if (i.type === 1) {
					if (deltaTime < dispTime) list[list.length] = new JudgeEvent(i.offsetX, i.offsetY, 1);
				} else if (i.type === 2) {
					if (deltaTime < dispTime) list[list.length] = new JudgeEvent(i.offsetX, i.offsetY, 2);
				} else if (i.type === 3) {
					if (i.holdTapTime) list[list.length] = new JudgeEvent(i.offsetX, i.offsetY, 2);
					else if (deltaTime < dispTime) list[list.length] = new JudgeEvent(i.offsetX, i.offsetY, 1);
				} else if (i.type === 4) {
					if (deltaTime < dispTime) list[list.length] = new JudgeEvent(i.offsetX, i.offsetY, 3);
				}
			}
		} else if (emitter.eq('play')) {
			for (const i of hitManager.list) {
				if (!i.isTapped) list[list.length] = new JudgeEvent(i.offsetX, i.offsetY, 1);
				if (i.isActive) list[list.length] = new JudgeEvent(i.offsetX, i.offsetY, 2);
				if (i.type === 'keyboard') list[list.length] = new JudgeEvent(i.offsetX, i.offsetY, 3); //以后加上Flick判断
				if (i.flicking && !i.flicked) {
					list[list.length] = new JudgeEvent(i.offsetX, i.offsetY, 3, i);
					// i.flicked = true; 不能在这里判断，因为可能会判定不到
				}
			}
		}
	},
	/**
	 * 以后扩充Note定义
	 * @param {Note[]} notes
	 * @param {number} realTime
	 * @param {number} width
	 */
	execute(notes, realTime, width) {
		const { list } = this;
		for (const note of notes) {
			if (note.scored) continue; //跳过已判分的Note
			const deltaTime = note.realTime - realTime;
			if (deltaTime > 0.2) break; //跳过判定范围外的Note
			if (note.type !== 1 && deltaTime > 0.16) continue;
			if ((deltaTime < -0.16 && note.frameCount > 4) && !note.holdStatus) { //超时且不为Hold拖判，判为Miss
				// console.log('Miss', i.name);
				note.status = 2;
				stat.addCombo(2, note.type);
				note.scored = true;
			} else if (note.type === 2) { //Drag音符
				if (deltaTime > 0) {
					for (const judgeEvent of list) {
						if (judgeEvent.type !== 1) continue; //跳过非Tap判定
						if (getJudgeOffset(judgeEvent, note) > width) continue;
						judgeEvent.preventBad = true;
					}
				}
				if (note.status !== 4) {
					for (const judgeEvent of list) {
						if (judgeEvent.type !== 2) continue; //跳过非Drag判定
						if (getJudgeOffset(judgeEvent, note) > width) continue;
						// console.log('Perfect', i.name);
						note.status = 4;
						break;
					}
				} else if (deltaTime < 0) {
					audio.play(res['HitSong1'], { gainrate: app.soundVolume });
					hitImageList.add(HitImage.perfect(note.projectX, note.projectY));
					stat.addCombo(4, 2);
					note.scored = true;
				}
			} else if (note.type === 4) { //Flick音符
				if (deltaTime > 0 || note.status !== 4) {
					for (const judgeEvent of list) {
						if (judgeEvent.type !== 1) continue; //跳过非Tap判定
						if (getJudgeOffset(judgeEvent, note) > width) continue;
						judgeEvent.preventBad = true;
					}
				}
				if (note.status !== 4) {
					for (const judgeEvent of list) {
						if (judgeEvent.type !== 3) continue; //跳过非Move判定
						if (getJudgeOffset(judgeEvent, note) > width) continue;
						let distance = getJudgeDistance(judgeEvent, note);
						let noteJudge = note;
						let nearcomp = false;
						for (const nearNote of note.nearNotes) {
							if (nearNote.status) continue;
							if (nearNote.realTime - realTime > 0.16) break;
							if (getJudgeOffset(judgeEvent, nearNote) > width) continue;
							const nearDistance = getJudgeDistance(judgeEvent, nearNote);
							if (nearDistance < distance) {
								distance = nearDistance;
								noteJudge = nearNote;
								nearcomp = true;
							}
						}
						//console.log('Perfect', i.name);
						if (!judgeEvent.event) {
							noteJudge.status = 4;
							if (!nearcomp) break;
						} else if (!judgeEvent.event.flicked) {
							noteJudge.status = 4;
							judgeEvent.event.flicked = true;
							if (!nearcomp) break;
						}
					}
				} else if (deltaTime < 0) {
					audio.play(res['HitSong2'], { gainrate: app.soundVolume });
					hitImageList.add(HitImage.perfect(note.projectX, note.projectY));
					stat.addCombo(4, 4);
					note.scored = true;
				}
			} else { //Hold音符
				if (note.type === 3 && note.holdTapTime) { //是否触发头判
					if ((performance.now() - note.holdTapTime) * note.holdTime >= 1.6e4 * note.realHoldTime) { //间隔时间与bpm成反比
						if (note.holdStatus % 4 === 0) hitImageList.add(HitImage.perfect(note.projectX, note.projectY));
						else if (note.holdStatus % 4 === 1) hitImageList.add(HitImage.perfect(note.projectX, note.projectY));
						else if (note.holdStatus % 4 === 3) hitImageList.add(HitImage.good(note.projectX, note.projectY));
						note.holdTapTime = performance.now();
					}
					if (deltaTime + note.realHoldTime < 0.2) {
						if (!note.status) stat.addCombo(note.status = note.holdStatus, 3);
						if (deltaTime + note.realHoldTime < 0) note.scored = true;
						continue;
					}
					note.holdBroken = true; //若1帧内未按住并使其转为false，则判定为Miss
				}
				for (const judgeEvent of list) {
					if (note.holdTapTime) { //头判
						if (judgeEvent.type !== 2) continue;
						if (getJudgeOffset(judgeEvent, note) <= width) {
							note.holdBroken = false;
							break;
						}
						continue;
					}
					if (judgeEvent.type !== 1) continue; //跳过非Tap判定
					if (judgeEvent.judged) continue; //跳过已触发的判定
					if (getJudgeOffset(judgeEvent, note) > width) continue;
					let deltaTime2 = deltaTime;
					let distance = getJudgeDistance(judgeEvent, note);
					let noteJudge = note;
					let nearcomp = false;
					for (const nearNote of note.nearNotes) {
						if (nearNote.status) continue;
						if (nearNote.holdTapTime) continue;
						const nearDeltaTime = nearNote.realTime - realTime;
						if (nearDeltaTime > 0.2) break;
						if (nearNote.type === 3 && nearDeltaTime > 0.16) continue;
						if (getJudgeOffset(judgeEvent, nearNote) > width) continue;
						const nearDistance = getJudgeDistance(judgeEvent, nearNote);
						if (nearDistance < distance) {
							deltaTime2 = nearDeltaTime;
							distance = nearDistance;
							noteJudge = nearNote;
							nearcomp = true;
						}
					}
					if (deltaTime2 > 0.16) {
						if (judgeEvent.preventBad) continue;
						noteJudge.status = 6; //console.log('Bad', i.name);
						noteJudge.badtime = performance.now();
					} else {
						stat.addDisp(Math.max(deltaTime2, (-1 - noteJudge.frameCount) * 0.04 || 0));
						audio.play(res['HitSong0'], { gainrate: app.soundVolume });
						if (deltaTime2 > 0.08) {
							noteJudge.holdStatus = 7; //console.log('Good(Early)', i.name);
							hitImageList.add(HitImage.good(noteJudge.projectX, noteJudge.projectY));
							hitWordList.add(HitWord.early(noteJudge.projectX, noteJudge.projectY));
						} else if (deltaTime2 > 0.04) {
							noteJudge.holdStatus = 5; //console.log('Perfect(Early)', i.name);
							hitImageList.add(HitImage.perfect(noteJudge.projectX, noteJudge.projectY));
							hitWordList.add(HitWord.early(noteJudge.projectX, noteJudge.projectY));
						} else if (deltaTime2 > -0.04 || noteJudge.frameCount < 1) {
							noteJudge.holdStatus = 4; //console.log('Perfect(Max)', i.name);
							hitImageList.add(HitImage.perfect(noteJudge.projectX, noteJudge.projectY));
						} else if (deltaTime2 > -0.08 || noteJudge.frameCount < 2) {
							noteJudge.holdStatus = 1; //console.log('Perfect(Late)', i.name);
							hitImageList.add(HitImage.perfect(noteJudge.projectX, noteJudge.projectY));
							hitWordList.add(HitWord.late(noteJudge.projectX, noteJudge.projectY));
						} else {
							noteJudge.holdStatus = 3; //console.log('Good(Late)', i.name);
							hitImageList.add(HitImage.good(noteJudge.projectX, noteJudge.projectY));
							hitWordList.add(HitWord.late(noteJudge.projectX, noteJudge.projectY));
						}
						if (noteJudge.type === 1) noteJudge.status = noteJudge.holdStatus;
					}
					if (noteJudge.status) {
						stat.addCombo(noteJudge.status, 1);
						noteJudge.scored = true;
					} else {
						noteJudge.holdTapTime = performance.now();
						noteJudge.holdBroken = false;
					}
					judgeEvent.judged = true;
					noteJudge.statOffset = deltaTime2; //qwq也许是统计偏移量？
					if (!nearcomp) break;
				}
				if (emitter.eq('play') && note.holdTapTime && note.holdBroken) {
					note.status = 2; //console.log('Miss', i.name);
					stat.addCombo(2, 3);
					note.scored = true;
				}
			}
		}
	}
};
class HitEvents extends Array {
	constructor({ updateCallback, iterateCallback } = {}) {
		super();
		this.update = this.defilter.bind(this, updateCallback);
		this.animate = this.iterate.bind(this, iterateCallback);
	}
	/**	@param {(value)=>boolean} predicate */
	defilter(predicate) {
		let i = this.length;
		while (i--) predicate(this[i]) && this.splice(i, 1);
		return this;
	}
	/**	@param {(item)=>any} callback */
	iterate(callback) {
		for (const i of this) callback(i); //qwq
	}
	add(value) {
		this[this.length] = value;
	}
	clear() {
		this.length = 0;
	}
}
const hitFeedbackList = new HitEvents({ //存放点击特效
	updateCallback: i => ++i.time > 0,
	iterateCallback: i => {
		ctxos.globalAlpha = 0.85;
		ctxos.setTransform(1, 0, 0, 1, i.offsetX, i.offsetY); //缩放
		ctxos.fillStyle = i.color;
		ctxos.beginPath();
		ctxos.arc(0, 0, app.lineScale * 0.5, 0, 2 * Math.PI);
		ctxos.fill();
	}
});
const hitImageList = new HitEvents({ //存放点击特效
	updateCallback: i => nowTime_ms >= i.time + i.duration,
	iterateCallback: i => {
		const tick = (nowTime_ms - i.time) / i.duration;
		ctxos.globalAlpha = 1;
		ctxos.setTransform(app.noteScaleRatio * 6, 0, 0, app.noteScaleRatio * 6, i.offsetX, i.offsetY); //缩放
		ctxos.drawImage(i.images[parseInt(tick * 30)] || i.images[i.images.length - 1], -128, -128); //停留约0.5秒
		ctxos.fillStyle = i.color;
		ctxos.globalAlpha = 1 - tick; //不透明度
		const r3 = 30 * (((0.2078 * tick - 1.6524) * tick + 1.6399) * tick + 0.4988); //方块大小
		for (const j of i.rand) {
			const ds = j[0] * (9 * tick / (8 * tick + 1)); //打击点距离
			ctxos.fillRect(ds * Math.cos(j[1]) - r3 / 2, ds * Math.sin(j[1]) - r3 / 2, r3, r3);
		}
	}
});
const hitWordList = new HitEvents({ //存放点击特效
	updateCallback: i => nowTime_ms >= i.time + i.duration,
	iterateCallback: i => {
		const tick = (nowTime_ms - i.time) / i.duration;
		ctxos.setTransform(1, 0, 0, 1, i.offsetX, i.offsetY); //缩放
		ctxos.font = `bold ${app.noteScaleRatio * (256 + 128 * (((0.2078 * tick - 1.6524) * tick + 1.6399) * tick + 0.4988))}px Custom,Saira`;
		ctxos.textAlign = 'center';
		ctxos.fillStyle = i.color;
		ctxos.globalAlpha = 1 - tick; //不透明度
		ctxos.fillText(i.text, 0, -app.noteScaleRatio * 128);
	}
});
class HitFeedback {
	constructor(offsetX, offsetY, n1, n2) {
		this.offsetX = Number(offsetX);
		this.offsetY = Number(offsetY);
		this.color = String(n1);
		this.text = String(n2);
		this.time = 0;
	}
	static tap(offsetX, offsetY) {
		//console.log('Tap', offsetX, offsetY);
		return new HitFeedback(offsetX, offsetY, 'cyan', '');
	}
	static hold(offsetX, offsetY) {
		//console.log('Hold', offsetX, offsetY);
		return new HitFeedback(offsetX, offsetY, 'lime', '');
	}
	static move(offsetX, offsetY) {
		//console.log('Move', offsetX, offsetY);
		return new HitFeedback(offsetX, offsetY, 'violet', '');
	}
}
class HitImage {
	constructor(offsetX, offsetY, n1, n2, n3) {
		this.offsetX = Number(offsetX) || 0;
		this.offsetY = Number(offsetY) || 0;
		this.time = performance.now();
		this.duration = 500;
		this.images = res['HitFX'][n1]; //以后做缺少检测
		this.color = String(n3);
		this.rand = Array(Number(n2) || 0).fill().map(() => [Math.random() * 80 + 185, Math.random() * 2 * Math.PI]);
	}
	static perfect(offsetX, offsetY) {
		return new HitImage(offsetX, offsetY, 'rgba(255,236,160,0.8823529)', 4, '#ffeca0');
	}
	static good(offsetX, offsetY) {
		return new HitImage(offsetX, offsetY, 'rgba(180,225,255,0.9215686)', 3, '#b4e1ff');
	}
}
class HitWord {
	constructor(offsetX, offsetY, n1, n2) {
		this.offsetX = Number(offsetX) || 0;
		this.offsetY = Number(offsetY) || 0;
		this.time = performance.now();
		this.duration = 250;
		this.color = String(n1);
		this.text = String(n2);
	}
	static early(offsetX, offsetY) {
		//console.log('Tap', offsetX, offsetY);
		return new HitWord(offsetX, offsetY, '#03aaf9', 'Early');
	}
	static late(offsetX, offsetY) {
		//console.log('Hold', offsetX, offsetY);
		return new HitWord(offsetX, offsetY, '#ff4612', 'Late');
	}
}
const interact = new InteractProxy(canvas);
//适配PC鼠标
interact.setMouseEvent({
	mousedownCallback(evt) {
		const idx = evt.button;
		const { x, y } = getPos(evt);
		if (idx === 1) hitManager.activate('mouse', 4, x, y);
		else if (idx === 2) hitManager.activate('mouse', 2, x, y);
		else hitManager.activate('mouse', 1 << idx, x, y);
		specialClick.qwq(x, y);
	},
	mousemoveCallback(evt) {
		const idx = evt.buttons;
		const { x, y } = getPos(evt);
		for (let i = 1; i < 32; i <<= 1) {
			// 同时按住多个键时，只有最后一个键的move事件会触发
			if (idx & i) hitManager.moving('mouse', i, x, y);
			else hitManager.deactivate('mouse', i);
		}
	},
	mouseupCallback(evt) {
		const idx = evt.button;
		if (idx === 1) hitManager.deactivate('mouse', 4);
		else if (idx === 2) hitManager.deactivate('mouse', 2);
		else hitManager.deactivate('mouse', 1 << idx);
	}
});
//适配键盘(喵喵喵?)
interact.setKeyboardEvent({
	keydownCallback(evt) {
		if (emitter.eq('stop')) return;
		if (evt.key === 'Shift') btnPause.click();
		else if (hitManager.list.find(i => i.type === 'keyboard' && i.id === evt.code)); //按住一个键时，会触发多次keydown事件
		else hitManager.activate('keyboard', evt.code, NaN, NaN);
	},
	keyupCallback(evt) {
		if (emitter.eq('stop')) return;
		if (evt.key !== 'Shift') hitManager.deactivate('keyboard', evt.code);
	}
});
self.addEventListener('blur', () => hitManager.clear('keyboard'));
//适配移动设备
interact.setTouchEvent({
	touchstartCallback(evt) {
		for (const i of evt.changedTouches) {
			const { x, y } = getPos(i);
			hitManager.activate('touch', i.identifier, x, y);
			specialClick.qwq(x, y);
		}
	},
	touchmoveCallback(evt) {
		for (const i of evt.changedTouches) {
			const { x, y } = getPos(i);
			hitManager.moving('touch', i.identifier, x, y);
		}
	},
	touchendCallback(evt) {
		for (const i of evt.changedTouches) {
			hitManager.deactivate('touch', i.identifier);
		}
	},
	touchcancelCallback(evt) {
		// if (emitter.eq('play')) qwqPause();
		for (const i of evt.changedTouches) {
			hitManager.deactivate('touch', i.identifier);
		}
	}
});
/** @param {MouseEvent|Touch} obj */
function getPos(obj) {
	const rect = canvas.getBoundingClientRect();
	return {
		x: (obj.clientX - rect.left) / canvas.offsetWidth * canvas.width - (canvas.width - canvasos.width) / 2,
		y: (obj.clientY - rect.top) / canvas.offsetHeight * canvas.height
	};
}
//hit end
const res = {}; //存放资源
//初始化
document.addEventListener('DOMContentLoaded', async function qwq() {
	document.removeEventListener('DOMContentLoaded', qwq);
	canvas.classList.add('fade');
	let loadedNum = 0;
	let errorNum = 0;
	msgHandler.sendMessage('初始化...');
	if (await checkSupport()) return;
	const res0 = {};
	const raw = {
		image: {
			JudgeLine: "//i0.hdslb.com/bfs/music/1673237951.png|8080",
			ProgressBar: "./src/ProgressBar.png|8080",
			SongsNameBar: "//i2.hdslb.com/bfs/music/1673237977.png|8080",
			HitFXRaw: "//i2.hdslb.com/bfs/face/5094e42fed15363384b856c8dcef6a9e06507b94.png|8080",
			Tap: "./src/respack/click.png|8080",
			TapHL: "./src/respack/click_mh.png|8080",
			Drag: "./src/respack/drag.png|8080",
			DragHL: "./src/respack/drag_mh.png|8080",
			HoldHead: "//i0.hdslb.com/bfs/music/1673237586.png|8080",
			HoldHeadHL: "//i2.hdslb.com/bfs/music/1673237551.png|7875",
			Hold: "//i0.hdslb.com/bfs/face/4cf84b98ea62e0bc9db3cca13576031573215404.png|8080",
			HoldHL: "//i0.hdslb.com/bfs/face/c0c8ab1f023b13bf9184059cb5af4d53560d84b4.png|7875",
			HoldEnd: "//i2.hdslb.com/bfs/music/1673238102.png|8080",
			Flick: "./src/respack/flick.png|8080",
			FlickHL: "./src/respack/flick_mh.png|8080",
			LevelOver1: "./src/LevelOver1.png|8080",
			LevelOver3: "./src/LevelOver3.png|8080",
			LevelOver4: "./src/LevelOver4.png|8080",
			LevelOver5: "./src/LevelOver5.png|8080",
			Rank: "./src/Rank.png|8080",
			Pause: "./src/PauseNew.png|8080",
			Rks: "./src/rks.png|8080"
		},
		audio: {
			HitSong0: "//i2.hdslb.com/bfs/music/1673231631.png|m8",
			HitSong1: "//i2.hdslb.com/bfs/music/1673231636.png|m8",
			HitSong2: "//i0.hdslb.com/bfs/music/1673231639.png|m8",
			LevelOver0_v1: "//i0.hdslb.com/bfs/music/1673230967.png|m8",
			LevelOver1_v1: "//i0.hdslb.com/bfs/music/1673230996.png|m8",
			LevelOver2_v1: "//i0.hdslb.com/bfs/music/1673231586.png|m8",
			LevelOver3_v1: "//i2.hdslb.com/bfs/music/1673231518.png|m8"
		},
		alternative: {
			LevelOver0_v1: "./src/js1.ogg",
			LevelOver1_v1: "./src/js2.ogg",
			LevelOver2_v1: "./src/js3.ogg",
			LevelOver3_v1: "./src/js4.ogg"
		}
	};

	// const raw = await fetch(atob('aHR0cHM6Ly9sY2h6aC5uZXQvZGF0YS9wYWNrLmpzb24=')).then(i => i.json());
	for (const j in raw.image || {}) res0[j] = raw.image[j];
	for (const j in raw.audio || {}) res0[j] = raw.audio[j];
	//加载资源
	await Promise.all(Object.entries(res0).map(([name, src], _i, arr) => new Promise(resolve => {
		const [url, ext] = src.split('|');
		fetch(url, { referrerPolicy: 'no-referrer' }).then(a => a.blob()).then(async blob => {
			const img = await createImageBitmap(blob);
			if (ext && ext[0] === 'm') {
				const data = decode(img, Number(ext.slice(1))).result;
				// 小米浏览器出现问题：decode出来的数据部分被有损压缩导致资源加载失败
				res[name] = await audio.decode(data).catch(async err => {
					const blob = await fetch(raw.alternative[name], { referrerPolicy: 'no-referrer' }).then(i => i.blob());
					return await createImageBitmap(blob).then(decodeAlt).then(audio.decode.bind(audio)).catch(err => {
						msgHandler.sendWarning(`您的浏览器存在问题，将导致以下音频无法正常播放：\n${name}(${err.message})\n如果多次刷新问题仍然存在，建议更换设备或浏览器。`);
						return audio.mute(1);
					});

					function decodeAlt(img) {
						const canvas = document.createElement('canvas');
						canvas.width = img.width;
						canvas.height = img.height;
						const ctx = canvas.getContext('2d');
						ctx.drawImage(img, 0, 0);
						const id = ctx.getImageData(0, 0, canvas.width, canvas.height);
						const ab = new Uint8Array(id.data.length / 4 * 3);
						const mask = (v, i) => v ^ (i ** 2 * 3473) & 255;
						for (let i = 0; i < ab.length; i++) ab[i] = id.data[((i / 3) | 0) * 4 + i % 3];
						const combined = new Uint8Array(ab.length / 2);
						for (let i = 0; i < ab.length / 2; i++) {
							combined[i] = mask((ab[i * 2] + 8) / 17 << 4 | (ab[i * 2 + 1] + 8) / 17, i);
						}
						const size = new DataView(combined.buffer, 0, 4).getUint32(0);
						return combined.buffer.slice(4, size + 4);
					}
				});
			} else {
				res[name] = await createImageBitmap(img, 0, 0, img.width, img.height /* , { imageOrientation: 'flipY' } */ );
			}
			msgHandler.sendMessage(`加载资源：${Math.floor(++loadedNum / arr.length * 100)}%`);
		}).catch(err => {
			console.error(err);
			msgHandler.sendError(`错误：${++errorNum}个资源加载失败（点击查看详情）`, `资源加载失败，请检查您的网络连接然后重试：\n${new URL(url,location)}`, true);
		}).finally(resolve);
	})));
	if (errorNum) return msgHandler.sendError(`错误：${errorNum}个资源加载失败（点击查看详情）`);
	res['NoImageBlack'] = await createImageBitmap(new ImageData(new Uint8ClampedArray(4).fill(0), 1, 1));
	res['NoImageWhite'] = await createImageBitmap(new ImageData(new Uint8ClampedArray(4).fill(255), 1, 1));
	res['JudgeLineMP'] = await imgShader(res['JudgeLine'], '#feffa9');
	res['JudgeLineFC'] = await imgShader(res['JudgeLine'], '#a2eeff');
	res['TapBad'] = await imgPainter(res['Tap'], '#6c4343');
	res['Ranks'] = await imgSplit(res['Rank']);
	res['Rank'].close();
	const hitRaw = await imgSplit(res['HitFXRaw']);
	res['HitFXRaw'].close();
	res['HitFX'] = {};
	res['HitFX']['rgba(255,236,160,0.8823529)'] = await Promise.all(hitRaw.map(img => imgShader(img, 'rgba(255,236,160,0.8823529)'))); //#fce491
	res['HitFX']['rgba(180,225,255,0.9215686)'] = await Promise.all(hitRaw.map(img => imgShader(img, 'rgba(180,225,255,0.9215686)'))); //#9ed5f3
	hitRaw.forEach(img => img.close());
	res['mute'] = audio.mute(1);
	if (!(() => {
			const b = document.createElement('canvas').getContext('2d');
			b.drawImage(res['JudgeLine'], 0, 0);
			return b.getImageData(0, 0, 1, 1).data[0];
		})()) return msgHandler.sendError('检测到图片加载异常，请关闭所有应用程序然后重试');
	msgHandler.sendMessage('等待上传文件...');
	$id('uploader').classList.remove('disabled');
	$id('select').classList.remove('disabled');
	emitter.dispatchEvent(new CustomEvent('change'));

	function decode(img, border = 0) {
		const canvas = document.createElement('canvas');
		canvas.width = img.width - border * 2;
		canvas.height = img.height - border * 2;
		const ctx = canvas.getContext('2d');
		ctx.drawImage(img, -border, -border);
		const id = ctx.getImageData(0, 0, canvas.width, canvas.width);
		const ab = new Uint8Array(id.data.length / 4 * 3);
		for (let i = 0; i < ab.length; i++) ab[i] = id.data[((i / 3) | 0) * 4 + i % 3] ^ (i * 3473);
		const size = new DataView(ab.buffer, 0, 4).getUint32(0);
		return { result: ab.buffer.slice(4, size + 4) };
	}
});
//必要组件
const frameAnimater = new FrameAnimater();
frameAnimater.setCallback(mainLoop);
let nowTime_ms = 0; //当前绝对时间(ms)
let curTime = 0; //最近一次暂停的音乐时间(s)
let curTime_ms = 0; //最近一次播放的绝对时间(ms)
let timeBgm = 0; //当前音乐时间(s)
let timeChart = 0; //当前谱面时间(s)
let duration = 0; //音乐时长(s)
let isInEnd = false; //开头过渡动画
let isOutStart = false; //结尾过渡动画
let isOutEnd = false; //临时变量
document.addEventListener('visibilitychange', () => document.visibilityState === 'hidden' && emitter.eq('play') && qwqPause());
document.addEventListener('pagehide', () => document.visibilityState === 'hidden' && emitter.eq('play') && qwqPause()); //兼容Safari
const qwqIn = new Timer();
const qwqOut = new Timer();
const qwqEnd = new Timer();
//播放bgm
function playBgm(data, offset) {
	if (!offset) offset = 0;
	curTime_ms = performance.now();
	tmps.bgMusic = audio.play(data, { offset: offset, playbackrate: app.speed, gainrate: app.musicVolume, interval: autoDelay.checked });
}
/** @param {HTMLVideoElement} data */
function playVideo(data, offset) {
	if (!offset) offset = 0;
	data.currentTime = offset;
	data.playbackRate = app.speed;
	data.muted = true;
	return data.play();
}
// class CanvasText {
// 	constructor() {
// 		/** @type {HTMLCanvasElement} */
// 		this.canvas = self.OffscreenCanvas ? new OffscreenCanvas(300, 100) : document.createElement('canvas');
// 		this.ctx = this.canvas.getContext('2d');
// 		this.ctx.textAlign = 'center';
// 		this.ctx.font = '30px sans-serif';
// 		this.ctx.fillStyle = '#000';
// 		this.ctx.strokeStyle = '#fff';
// 		this.ctx.lineWidth = 2;
// 	}
// 	/** @param {string} text */
// 	setText(text) {
// 		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
// 		this.ctx.fillText(text, this.canvas.width / 2, this.canvas.height / 2);
// 		this.ctx.strokeText(text, this.canvas.width / 2, this.canvas.height / 2);
// 	}
// }
let fucktemp1 = false;
let fucktemp2 = false;
const tmps = {
	bgImage: null,
	bgMusic: () => {},
	progress: 0,
	name: '',
	artist: '',
	illustrator: '',
	charter: '',
	level: '',
	combo: '',
	combo2: ''
};
//作图
function mainLoop() {
	frameTimer.addTick(); //计算fps
	const { lineScale } = app;
	nowTime_ms = performance.now();
	app.resizeCanvas();
	//计算时间
	if (qwqOut.second < 0.67) {
		loopNoCanvas();
		main['flag{qwq}'](timeBgm);
		loopCanvas();
	} else if (!fucktemp1) {
		fucktemp1 = true;
		audio.stop();
		btnPause.classList.add('disabled'); //qwq
		ctxos.globalCompositeOperation = 'source-over';
		ctxos.resetTransform();
		ctxos.globalAlpha = 1;
		const bgImage = $id('imageBlur').checked ? app.bgImageBlur : app.bgImage;
		ctxos.drawImage(bgImage, ...adjustSize(bgImage, canvasos, 1));
		ctxos.fillStyle = '#000'; //背景变暗
		ctxos.globalAlpha = app.brightness; //背景不透明度
		ctxos.fillRect(0, 0, canvasos.width, canvasos.height);
		setTimeout(() => {
			if (!fucktemp1) return; //防止快速重开后直接结算
			const difficulty = ['ez', 'hd', 'in', 'at'].indexOf(levelText.slice(0, 2).toLocaleLowerCase());
			audio.play(res[`LevelOver${difficulty < 0 ? 2 : difficulty}_v1`], { loop: true });
			qwqEnd.reset();
			qwqEnd.play();
			stat.level = Number(levelText.match(/\d+$/));
			fucktemp2 = stat.getData(app.playMode === 1, selectspeed.value);
		}, 1e3);
	} //只让它执行一次
	if (fucktemp2) qwqdraw3(fucktemp2);
	ctx.globalAlpha = 1;
	const bgImage = $id('imageBlur').checked ? app.bgImageBlur : app.bgImage;
	ctx.drawImage(bgImage, ...adjustSize(bgImage, canvas, 1.1));
	ctx.fillStyle = '#000';
	ctx.globalAlpha = 0.4;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.globalAlpha = 1;
	ctx.drawImage(canvasos, (canvas.width - canvasos.width) / 2, 0);
	//Copyright
	ctx.font = `${lineScale * 0.4}px Saira`;
	ctx.fillStyle = '#ccc';
	ctx.globalAlpha = 0.8;
	ctx.textAlign = 'right';
}

function loopNoCanvas() {
	if (!isInEnd && qwqIn.second >= 3) {
		isInEnd = true;
		playBgm(app.bgMusic);
		if (app.bgVideo) playVideo(app.bgVideo);
	}
	if (emitter.eq('play') && isInEnd && !isOutStart) timeBgm = curTime + (nowTime_ms - curTime_ms) / 1e3;
	if (timeBgm >= duration) isOutStart = true;
	if (showTransition.checked && isOutStart && !isOutEnd) {
		isOutEnd = true;
		qwqOut.play();
	}
	timeChart = Math.max(timeBgm - (app.chart.offset + Number(inputOffset.value) / 1e3 || 0) / app.speed, 0);
	//遍历判定线events和Note
	app.updateByTime(timeChart);
	//更新打击特效和触摸点动画
	hitFeedbackList.update();
	hitImageList.update();
	hitWordList.update();
	for (const i of hitManager.list) {
		if (i.type === 'keyboard') continue;
		if (!i.isTapped) hitFeedbackList.add(HitFeedback.tap(i.offsetX, i.offsetY));
		else if (i.isMoving) hitFeedbackList.add(HitFeedback.move(i.offsetX, i.offsetY)); //qwq
		else if (i.isActive) hitFeedbackList.add(HitFeedback.hold(i.offsetX, i.offsetY));
	}
	//触发判定和播放打击音效
	if (isInEnd) {
		const judgeWidth = canvasos.width * 0.118125;
		judgeManager.addEvent(app.notes, timeChart);
		judgeManager.execute(app.drags, timeChart, judgeWidth);
		judgeManager.execute(app.flicks, timeChart, judgeWidth);
		judgeManager.execute(app.tapholds, timeChart, judgeWidth);
	}
	//更新判定
	hitManager.update();
	if (qwq[4] && stat.good + stat.bad) {
		stat.level = Number(levelText.match(/\d+$/));
		stat.reset();
		Promise.resolve().then(qwqStop).then(qwqStop);
	}
	tmps.bgImage = $id('imageBlur').checked ? app.bgImageBlur : app.bgImage;
	tmps.progress = (main.qwqwq ? duration - timeBgm : timeBgm) / duration;
	tmps.name = inputName.value || inputName.placeholder;
	tmps.artist = inputArtist.value;
	tmps.illustrator = inputIllustrator.value || inputIllustrator.placeholder;
	tmps.charter = inputCharter.value || inputCharter.placeholder;
	tmps.level = levelText;
	if (stat.combo > 2) {
		tmps.combo = `${stat.combo}`;
		tmps.combo2 = app.playMode === 1 ? 'COMBO' : 'COMBO';
	} else tmps.combo = tmps.combo2 = '';
}

function loopCanvas() { //尽量不要在这里出现app
	const { lineScale, noteScaleRatio } = app;
	ctxos.clearRect(0, 0, canvasos.width, canvasos.height); //重置画面
	//绘制背景
	ctxos.globalAlpha = 1;
	ctxos.drawImage(tmps.bgImage, ...adjustSize(tmps.bgImage, canvasos, 1));
	if (isInEnd && app.bgVideo && !main.qwqwq) {
		const { videoWidth: width, videoHeight: height } = app.bgVideo;
		ctxos.drawImage(app.bgVideo, ...adjustSize({ width, height }, canvasos, 1));
	}
	// if (qwq[4]) ctxos.filter = `hue-rotate(${energy*360/7}deg)`;
	if (qwqIn.second >= 2.5 && !stat.lineStatus) drawLine(0, lineScale); //绘制判定线(背景后0)
	// if (qwq[4]) ctxos.filter = 'none';
	ctxos.resetTransform();
	ctxos.fillStyle = '#000'; //背景变暗
	ctxos.globalAlpha = app.brightness; //背景不透明度
	ctxos.fillRect(0, 0, canvasos.width, canvasos.height);
	// if (qwq[4]) ctxos.filter = `hue-rotate(${energy*360/7}deg)`;
	if (qwqIn.second >= 2.5) drawLine(stat.lineStatus ? 2 : 1, lineScale); //绘制判定线(背景前1)
	// if (qwq[4]) ctxos.filter = 'none';
	ctxos.resetTransform();
	if (qwqIn.second >= 3 && qwqOut.second === 0) {
		//绘制note
		for (const i of app.holds) drawHold(i, timeChart);
		for (const i of app.dragsReversed) drawDrag(i);
		for (const i of app.tapsReversed) drawTap(i);
		for (const i of app.flicksReversed) drawFlick(i);
		if (showPoint.checked) { //绘制定位点
			ctxos.font = `${lineScale}px Saira`;
			ctxos.textAlign = 'center';
			for (const i of app.linesReversed) {
				ctxos.setTransform(i.cosr, i.sinr, -i.sinr, i.cosr, i.offsetX, i.offsetY);
				ctxos.globalAlpha = 1;
				ctxos.fillStyle = 'violet';
				ctxos.fillRect(-lineScale * 0.2, -lineScale * 0.2, lineScale * 0.4, lineScale * 0.4);
				ctxos.fillStyle = 'yellow';
				ctxos.globalAlpha = (i.alpha + 0.5) / 1.5;
				ctxos.fillText(i.lineId, 0, -lineScale * 0.3);
			}
			for (const i of app.notesReversed) {
				if (!i.visible) continue;
				ctxos.setTransform(i.cosr, i.sinr, -i.sinr, i.cosr, i.offsetX, i.offsetY);
				ctxos.globalAlpha = 1;
				ctxos.fillStyle = 'lime';
				ctxos.fillRect(-lineScale * 0.2, -lineScale * 0.2, lineScale * 0.4, lineScale * 0.4);
				ctxos.fillStyle = 'cyan';
				ctxos.globalAlpha = i.realTime > timeChart ? 1 : 0.5;
				ctxos.fillText(i.name, 0, -lineScale * 0.3);
			}
		}
	}
	if ($id('feedback').checked) hitFeedbackList.animate(); //绘制打击特效0
	// if (qwq[4]) ctxos.filter = `hue-rotate(${energy*360/7}deg)`;
	hitImageList.animate(); //绘制打击特效1
	// if (qwq[4]) ctxos.filter = 'none';
	if (showCE2.checked) hitWordList.animate(); //绘制打击特效2
	ctxos.globalAlpha = 1;
	//绘制进度条
	ctxos.setTransform(canvasos.width / 1920, 0, 0, canvasos.width / 1920, 0, lineScale * (qwqIn.second < 0.67 ? (tween.easeOutSine(qwqIn.second * 1.5) - 1) : -tween.easeOutSine(qwqOut.second * 1.5)) * 1.75);
	ctxos.drawImage(res['ProgressBar'], tmps.progress * 1920 - 1920, 0);
	//绘制文字
	ctxos.resetTransform();
	ctxos.fillStyle = '#fff';
	//开头过渡动画
	if (qwqIn.second < 3) {
		if (qwqIn.second < 0.67) ctxos.globalAlpha = tween.easeOutSine(qwqIn.second * 1.5);
		else if (qwqIn.second >= 2.5) ctxos.globalAlpha = tween.easeOutSine(6 - qwqIn.second * 2);
		ctxos.textAlign = 'center';
		//曲名、曲师、曲绘和谱师
		fillTextNode(tmps.name, app.wlen, app.hlen * 0.75, lineScale * 1.1, canvasos.width - lineScale * 1.5);
		fillTextNode(tmps.artist, app.wlen, app.hlen * 0.75 + lineScale * 1.25, lineScale * 0.55, canvasos.width - lineScale * 1.5);
		fillTextNode(`曲绘: ${tmps.illustrator}`, app.wlen, app.hlen * 1.25 + lineScale * 0.55, lineScale * 0.55, canvasos.width - lineScale * 1.5);
		fillTextNode(`谱面: ${tmps.charter}`, app.wlen, app.hlen * 1.25 + lineScale * 1.4, lineScale * 0.55, canvasos.width - lineScale * 1.5);
		//判定线(装饰用)
		ctxos.globalAlpha = 1;
		ctxos.setTransform(1, 0, 0, 1, app.wlen, app.hlen);
		const imgW = lineScale * 48 * (qwqIn.second < 0.67 ? tween.easeInSine(qwqIn.second * 1.5) : 1);
		const imgH = lineScale * 0.15; //0.1333...
		if (qwqIn.second >= 2.5) ctxos.globalAlpha = tween.easeOutSine(6 - qwqIn.second * 2);
		ctxos.drawImage(lineColor.checked ? res['JudgeLineMP'] : res['JudgeLine'], -imgW / 2, -imgH / 2, imgW, imgH);
	}
	//绘制分数和combo
	ctxos.globalAlpha = 1;
	ctxos.setTransform(1, 0, 0, 1, 0, lineScale * (qwqIn.second < 0.67 ? (tween.easeOutSine(qwqIn.second * 1.5) - 1) : -tween.easeOutSine(qwqOut.second * 1.5)) * 1.75);
	ctxos.font = `${lineScale * 0.95}px Saira,Saira`;
	ctxos.textAlign = 'right';
	ctxos.fillText(stat.scoreStr, canvasos.width - lineScale * 0.65, lineScale * 1.375); //分数位置
	ctxos.drawImage(res['Pause'], lineScale * 0.6, lineScale * 0.7, lineScale * 0.63, lineScale * 0.7);
	if (showAcc.checked) {
		ctxos.globalAlpha = 0.75;
		ctxos.font = `${lineScale * 0.66}px Saira,Saira`;
		ctxos.fillText(stat.accStr, canvasos.width - lineScale * 0.65, lineScale * 2.05); //acc位置
	}

	ctxos.globalAlpha = 1;
	ctxos.textAlign = 'left';
	ctxos.font = `${lineScale * 1.32}px Saira,Saira`;
	ctxos.fillText(tmps.combo, app.wlen, lineScale * 1.375); //连坤数
	ctxos.globalAlpha = qwqIn.second < 0.67 ? tween.easeOutSine(qwqIn.second * 1.5) : (1 - tween.easeOutSine(qwqOut.second * 1.5));
	ctxos.font = `${lineScale * 0.4}px Saira,Saira`;
	ctxos.fillText(tmps.combo2, app.wlen, lineScale * 1.95);; //文本Combo or autoplay
	//绘制曲名和等级
	ctxos.globalAlpha = 1;
	ctxos.setTransform(1, 0, 0, 1, 0, lineScale * (qwqIn.second < 0.67 ? (1 - tween.easeOutSine(qwqIn.second * 1.5)) : tween.easeOutSine(qwqOut.second * 1.5)) * 1.75);
	ctxos.textAlign = 'right';
	fillTextNode(tmps.level, canvasos.width - lineScale * 0.66, canvasos.height - lineScale * 0.65, lineScale * 0.65, app.wlen - lineScale); //第一个右对齐，第二个下对齐，第三个字体大小
	ctxos.textAlign = 'left';
	fillTextNode(tmps.name, lineScale * 0.65, canvasos.height - lineScale * 0.66, lineScale * 0.63, app.wlen - lineScale);
	ctxos.resetTransform();
	//绘制时间和帧率以及note打击数
	if (qwqIn.second < 0.67) ctxos.globalAlpha = tween.easeOutSine(qwqIn.second * 1.5);
	else ctxos.globalAlpha = 1 - tween.easeOutSine(qwqOut.second * 1.5);
	ctxos.font = `${lineScale * 0.4}px Saira,Saira`;
	ctxos.textAlign = 'left';
	ctxos.fillText(`${time2Str(main.qwqwq?duration-timeBgm:timeBgm)}/${time2Str(duration)}${status2.text}`, lineScale * 0.05, lineScale * 0.6);
	ctxos.textAlign = 'right';
	ctxos.fillText('FPS' + frameTimer.fpsStr, canvasos.width - lineScale * 0.05, lineScale * 0.6);
	if (showStat.checked) {
		ctxos.textAlign = 'right';
		[stat.noteRank[6], stat.noteRank[7], stat.noteRank[5], stat.noteRank[4], stat.noteRank[1], stat.noteRank[3], stat.noteRank[2]].forEach((val, idx) => {
			const comboColor = ['#fe7b93', '#0ac3ff', 'lime', '#f0ed69', 'lime', '#0ac3ff', '#999'];
			ctxos.fillStyle = comboColor[idx];
			ctxos.fillText(val, canvasos.width - lineScale * 0.05, canvasos.height / 2 + lineScale * (idx - 2.8) * 0.5);
		});
		ctxos.fillStyle = '#fff';
		ctxos.textAlign = 'left';
		ctxos.fillText(`DSP:  ${stat.curDispStr}`, lineScale * 0.05, canvasos.height / 2 - lineScale * 0.15);
		ctxos.fillText(`AVG:  ${stat.avgDispStr}`, lineScale * 0.05, canvasos.height / 2 + lineScale * 0.35);
		ctxos.textAlign = 'center';
		stat.combos.forEach((val, idx) => {
			const comboColor = ['#fff', '#0ac3ff', '#f0ed69', '#a0e9fd', '#fe4365'];
			ctxos.fillStyle = comboColor[idx];
			ctxos.fillText(val, lineScale * (idx + 0.55) * 1.1, canvasos.height - lineScale * 0.1);
		});
	}
}
//判定线函数，undefined/0:默认,1:非,2:恒成立
function drawLine(bool, lineScale) {
	ctxos.globalAlpha = 1;
	const tw = 1 - tween.easeOutSine(qwqOut.second * 1.5);
	for (const i of app.linesReversed) {
		if (bool ^ i.imageD && qwqOut.second < 0.67) {
			ctxos.globalAlpha = i.alpha;
			ctxos.setTransform(i.cosr * tw, i.sinr, -i.sinr * tw, i.cosr, app.wlen + (i.offsetX - app.wlen) * tw, i.offsetY); //hiahiah
			const imgS = (i.imageU ? lineScale * 18.75 : canvasos.height) * i.imageS / 1080;
			const imgW = imgS * i.imageW * i.imageA;
			const imgH = imgS * i.imageH;
			ctxos.drawImage(i.imageL[i.imageC && lineColor.checked ? stat.lineStatus : 0], -imgW / 2, -imgH / 2, imgW, imgH);
		}
	}
}

function fillTextNode(text, x, y, size, maxWidth) {
	ctxos.font = `${size}px Saira`;
	const dx = ctxos.measureText(text).width;
	if (dx > maxWidth) ctxos.font = `${size / dx * maxWidth}px Saira`;
	ctxos.fillText(text, x, y);
	return dx;
}

function qwqdraw3(statData) {
	// ctxos.resetTransform();
	// ctxos.globalCompositeOperation = "source-over";
	// ctxos.clearRect(0, 0, canvasos.width, canvasos.height);
	// ctxos.globalAlpha = 1;
	// ctxos.fillStyle = "#000"; //鑳屾櫙鍙樻殫
	// ctxos.globalAlpha = selectglobalalpha.value == "" ? 0.6 : selectglobalalpha.value; //鑳屾櫙涓嶉€忔槑搴�
	// ctxos.fillRect(0, 0, canvasos.width, canvasos.height);
	// ctxos.globalCompositeOperation = "destination-out";
	ctxos.globalAlpha = 1;
	const k = 3.7320508075688776; //tan75掳
	// ctxos.setTransform(canvasos.width - canvasos.height / k, 0, -canvasos.height / k, canvasos.height, canvasos.height / k, 0);
	// ctxos.fillRect(0, 0, 1, tween[8](range((qwqEnd.second - 0.13) * 0.94)));
	// ctxos.resetTransform();
	// ctxos.globalCompositeOperation = "destination-over";
	const qwq0 = (canvasos.width - canvasos.height / k) / (16 - 9 / k);
	ctxos.setTransform(qwq0 / 120, 0, 0, qwq0 / 120, app.wlen - qwq0 * 8, app.hlen - qwq0 * 4.5); //?
	// ctxos.drawImage(res["LevelOver4"], 183, 42, 1184, 228);
	// ctxos.globalAlpha = range((qwqEnd.second - 0.27) / 0.83);
	// ctxos.drawImage(res["LevelOver1"], 102, 378);
	ctxos.globalAlpha = 1;
	let imgWidthAct = 675 * (app.bgImage.width / app.bgImage.height),
	imgHeightAct = 675;
	if (imgWidthAct < 1200) {
		imgWidthAct = 1200;
		imgHeightAct = 1200 * (app.bgImage.height / app.bgImage.width);
	}
	ctxos.drawImage(app.bgImage, -1920 * tween.ease10(range(qwqEnd.second * 1)) + 2500.5 - imgWidthAct/2, 208 - (imgHeightAct - 660)/2, imgWidthAct, imgHeightAct);
	ctxos.beginPath();
	ctxos.moveTo(-1920 * tween.ease10(range(qwqEnd.second * 1)) + 2143.8539007193578074, 208);
	ctxos.lineTo(-1920 * tween.ease10(range(qwqEnd.second * 1)) + 3034, 208);
	ctxos.lineTo(-1920 * tween.ease10(range(qwqEnd.second * 1)) + 2858.3860992806421925, 868);
	ctxos.lineTo(-1920 * tween.ease10(range(qwqEnd.second * 1)) + 1968.24, 868);
	ctxos.closePath();
	ctxos.globalCompositeOperation = "destination-in";
	ctxos.fill();
	ctxos.globalCompositeOperation = "source-over";
	ctxos.globalAlpha = 0.5;
	ctxos.drawImage(res["LevelOver1"], -1720 * tween.ease10(range(qwqEnd.second - 0.1)) + 2768, 160, 849, 424.5);
	ctxos.drawImage(res["LevelOver3"], -1020 * tween.ease10(range(qwqEnd.second * 0.9 - 0.25)) + 1944, 550, 950, 190);
	ctxos.drawImage(res["LevelOver3"], -1020 * tween.ease10(range(qwqEnd.second * 0.8 - 0.3)) + 1900, 715, 950, 190);
	ctxos.globalAlpha = 1;
	ctxos.drawImage(res["LevelOver4"], -1920 * tween.ease10(range(qwqEnd.second * 1)) + 1694, 137, 1616, 804);
	//姝屽悕鍜岀瓑绾�
	ctxos.globalAlpha = 1;
	ctxos.restore();
	ctxos.setTransform(qwq0 / 120, 0, 0, qwq0 / 120, app.wlen - qwq0 * 8, app.hlen - qwq0 * 4.5); //?
	ctxos.fillStyle = "#fff";
	ctxos.textBaseline = "middle";
	ctxos.textAlign = "left";
	ctxos.font = "73.5px Saira,SyHybrid,Noto Sans SC";
	const dxsnm = ctxos.measureText(inputName.value || inputName.placeholder).width;
	if (dxsnm > 600) ctxos.font = `${73.5/dxsnm*600}px Saira,SyHybrid,Noto Sans SC`;
	ctxos.fillText(inputName.value || inputName.placeholder, -1920 * tween.ease10(range(qwqEnd.second * 1)) + 2028, 802);
	ctxos.font = "30px Saira,SyHybrid,Noto Sans SC";
	const dxlvl = ctxos.measureText(levelText).width;
	if (dxlvl > 150) ctxos.font = `${30/dxlvl*150}px Saira,SyHybrid,Noto Sans SC`;
	ctxos.textAlign = "right";
	ctxos.fillText(levelText, -1920 * tween.ease10(range(qwqEnd.second * 1)) + 2830, 825);
	ctxos.textAlign = "left";
	//Rank鍥炬爣
	ctxos.globalAlpha = range((qwqEnd.second - 1.3) * 3.75);
	const qwq2 = 293 + range((qwqEnd.second - 1.3) * 3.75) * 100;
	const qwq3 = 410 - tween.ease15(range((qwqEnd.second - 1.3) * 1.5)) * 164;
	if (stat.lineStatus == 3) ctxos.drawImage(res["FCV"], 1693 - qwq3, 373 - qwq3, qwq3 * 2, qwq3 * 2);
	else ctxos.drawImage(res["Ranks"][stat.rankStatus], 1693 - qwq3, 373 - qwq3, qwq3 * 2, qwq3 * 2);
	//鍑嗗害鍜岃繛鍑�
	ctxos.globalAlpha = range((qwqEnd.second - 0.4) * 2.50);
	ctxos.fillStyle = "#fff";
	ctxos.font = "25px Saira,SyHybrid,Noto Sans SC";
	ctxos.fillText(statData.newBestStr, -1720 * tween.ease10(range(qwqEnd.second - 0.1)) + 2855, 485);
	ctxos.fillStyle = "#fff";
	ctxos.textAlign = "left";
	ctxos.fillText(statData.scoreBest, -1720 * tween.ease10(range(qwqEnd.second - 0.1)) + 3005, 485);
	// 	ctxos.globalAlpha = range((qwqEnd.second - 1.87) * 2.50);
	ctxos.textAlign = "left";
	ctxos.fillText(statData.scoreDelta + '理论值附加 +' + stat.perfect, -1720 * tween.ease10(range(qwqEnd.second - 0.1)) + 3140, 485);
	ctxos.globalAlpha = range((qwqEnd.second - 0.8) * 1.50);
	ctxos.textAlign = "right";
	ctxos.font = "50px SyHybrid,Saira";
	ctxos.fillText(stat.accStr, -1020 * tween.ease10(range(qwqEnd.second * 0.9 - 0.25)) + 2749, 635);
	ctxos.font = "26px SyHybrid,Saira,Noto Sans SC";
	ctxos.fillText('准确率' + 'RKS:' + stat.RTR, -1020 * tween.ease10(range(qwqEnd.second * 0.9 - 0.25)) + 2755, 670);
	ctxos.textAlign = "left";
	ctxos.font = "50px Saira,SyHybrid,Noto Sans SC";
	ctxos.fillText(stat.maxcombo, -1020 * tween.ease10(range(qwqEnd.second * 0.9 - 0.25)) + 2100, 635);
	ctxos.font = "26px Saira,SyHybrid,Noto Sans SC";
	ctxos.fillText("Max Combo", -1020 * tween.ease10(range(qwqEnd.second * 0.9 - 0.25)) + 2095, 670);
	// ctxos.fillStyle = statData[4];
	//鍒嗘暟
	ctxos.fillStyle = "#fff";
	ctxos.textAlign = "left";
	ctxos.font = "86px Saira,SyHybrid,Noto Sans SC";
	ctxos.globalAlpha = range((qwqEnd.second - 0.4) * 2.00);
	ctxos.fillText(stat.scoreStr, -1720 * tween.ease10(range(qwqEnd.second - 0.1)) + 2845, 433);
	ctxos.textAlign = "right";
	ctxos.font = "25px Saira,SyHybrid,Noto Sans SC";
	ctxos.fillStyle = "#83e691";
	ctxos.fillText(app.speed === 1 ? '' : statData.textAboveStr.replace('{SPEED}', app.speed.toFixed(2)), -1920 * tween.ease10(range(qwqEnd.second * 1)) + 2830, 792);
		//Perfect, good, bad, miss
		ctxos.fillStyle = "#fff";
		ctxos.font = "43px Saira,SyHybrid,Noto Sans SC";
		ctxos.textAlign = "center";
		ctxos.globalAlpha = range((qwqEnd.second - 1.25) * 2.50);
		ctxos.fillText(stat.perfect, -1020 * tween.ease10(range(qwqEnd.second * 0.8 - 0.3)) + 2085, 805);
		ctxos.fillText(stat.good, -1020 * tween.ease10(range(qwqEnd.second * 0.8 - 0.3)) + 2233, 805);
		ctxos.fillText(stat.noteRank[6], -1020 * tween.ease10(range(qwqEnd.second * 0.8 - 0.3)) + 2340, 805);
		ctxos.fillText(stat.noteRank[2], -1020 * tween.ease10(range(qwqEnd.second * 0.8 - 0.3)) + 2447, 805);
		ctxos.font = "17px Saira";
		ctxos.fillText("Perfect", -1020 * tween.ease10(range(qwqEnd.second * 0.8 - 0.3)) + 2085, 834);
		ctxos.fillText("Good", -1020 * tween.ease10(range(qwqEnd.second * 0.8 - 0.3)) + 2233, 834);
		ctxos.fillText("Bad", -1020 * tween.ease10(range(qwqEnd.second * 0.8 - 0.3)) + 2340, 834);
		ctxos.fillText("Miss", -1020 * tween.ease10(range(qwqEnd.second * 0.8 - 0.3)) + 2447, 834);
		ctxos.font = "26px Saira";
		//Early, Late
		const qwq4 = range((qwq[3] > 0 ? qwqEnd.second - qwq[3] : 0.2 - qwqEnd.second - qwq[3]) * 5.00);
		ctxos.textAlign = "left";
		ctxos.fillText("Early", -1020 * tween.ease10(range(qwqEnd.second * 0.8 - 0.3)) + 2540, 800);
		ctxos.fillText("Late", -1020 * tween.ease10(range(qwqEnd.second * 0.8 - 0.3)) + 2540, 826);
		ctxos.textAlign = "right";
		if (autoplay.checked) {
			ctxos.globalAlpha = range((qwqEnd.second - 1.25) * 2.50);
		} else {
			let curHyperAlpha = 1 * range((qwqEnd.second - 1.07) * 2.50) * qwq4;
			if ( curHyperAlpha == 0 ) {
				ctxos.globalAlpha = range((qwqEnd.second - 1.25) * 2.50);
			} else {
				if ( qwqEnd.second <= 2.50 ) {
					ctxos.globalAlpha = 0
				} else {
					ctxos.globalAlpha = 1 - 1 * range((qwqEnd.second - 1.07) * 2.50) * qwq4;
				}
			}
		}
		ctxos.fillText(stat.noteRank[7], -1020 * tween.ease10(range(qwqEnd.second * 0.8 - 0.3)) + 2705, 800);
		ctxos.fillText(stat.noteRank[3], -1020 * tween.ease10(range(qwqEnd.second * 0.8 - 0.3)) + 2705, 826);
		ctxos.globalAlpha = 0;
		ctxos.fillStyle = '#696';
		ctxos.fill(new Path2D('M841,718s-10,0-10,10v80s0,10,10,10h100s10,0,10-10v-80s0-10-10-10h-40l-10-20-10,20h-40z'));
		ctxos.globalAlpha = 1 * range((qwqEnd.second - 1.07) * 2.50) * qwq4;
		ctxos.fillStyle = '#669';
		ctxos.fillStyle = '#8ecbf1';
		if ( qwqEnd.second > 2.50 ) {
			ctxos.globalAlpha = range((qwqEnd.second - 0.97) * 2.50) * qwq4;
		} else {
			let curHyperAlpha = 1 * range((qwqEnd.second - 1.07) * 2.50) * qwq4;
			if ( curHyperAlpha == 1 ) {
				ctxos.globalAlpha = range((qwqEnd.second - 1.25) * 2.50);
			} else {
				ctxos.globalAlpha = range((qwqEnd.second - 0.97) * 2.50) * qwq4;
			}
		}
		ctxos.textAlign = "right";
		if (autoplay.checked) {} else {
			ctxos.fillText(stat.noteRank[5], -1020 * tween.ease10(range(qwqEnd.second * 0.8 - 0.3)) + 2705, 800);
			ctxos.fillText(stat.noteRank[1], -1020 * tween.ease10(range(qwqEnd.second * 0.8 - 0.3)) + 2705, 826);
		}
		ctxos.globalAlpha = range((qwqEnd.second - 1.17) * 2.50) * qwq4;
		ctxos.resetTransform();
	}

function clip(num) {
	if (num < 0) return 0;
	if (num > 1) return 1;
	return num;
}
class NoteRender {
	constructor() {
		this.urlMap = new Map();
	}
	init(pack = {}) {
		this.res = {
			Tap: 'src/respack/click.png', //tap
			TapHL: 'src/respack/click_mh.png',//多押tap
			Drag: 'src/respack/drag.png',
			DragHL: 'src/respack/darg_mh.png',
			Hold: 'src/respack/hold_mh.png',
			HoldHL: 'src/respack/hold_mh.png',
			Flick: 'src/respack/flick.png',
			FlickHL: 'src/respack/flick_mh.png',
			FCV: 'src/FCV.png',
			Hit_FX: 'src/hit_fx.png',
			Hold: 'src/hold.png',
			Hold_HL: 'src/hold_mh.png',
			LevelOver1: 'src/LevelOver1.png',
			LevelOver3: 'src/LevelOver3.png',
			LevelOver4: 'src/LevelOver4.png',
			LevelOver5: 'src/LevelOver5.png',
			Rank: 'src/Rank.png',
			LevelOver0_v2: './src/js1.ogg',
			LevelOver1_v2: './src/js2.ogg',
			LevelOver2_v2: './src/js3.ogg',
			LevelOver3_v2: './src/js4.ogg'
		};
	}
	async load() {} //todo
}
//绘制Note
function drawTap(note) {
	const HL = note.isMulti && app.multiHint;
	const nsr = app.noteScaleRatio;
	if (!note.visible || note.scored && !note.badtime) return;
	ctxos.setTransform(nsr * note.cosr, nsr * note.sinr, -nsr * note.sinr, nsr * note.cosr, note.offsetX, note.offsetY);
	if (note.badtime) {
		ctxos.globalAlpha = 1 - clip((performance.now() - note.badtime) / 500);
		ctxos.drawImage(res['TapBad'], -res['TapBad'].width * 0.5, -res['TapBad'].height * 0.5);
	} else {
		ctxos.globalAlpha = note.alpha || (note.showPoint && showPoint.checked ? 0.45 : 0);
		if (main.qwqwq) ctxos.globalAlpha *= Math.max(1 + (timeChart - note.realTime) / 1.5, 0); //过线前1.5s出现
		if (HL) ctxos.drawImage(res['TapHL'], -res['TapHL'].width * 0.5, -res['TapHL'].height * 0.5);
		else ctxos.drawImage(res['Tap'], -res['Tap'].width * 0.5, -res['Tap'].height * 0.5);
	}
}

function drawDrag(note) {
	const HL = note.isMulti && app.multiHint;
	const nsr = app.noteScaleRatio;
	if (!note.visible || note.scored && !note.badtime) return;
	ctxos.setTransform(nsr * note.cosr, nsr * note.sinr, -nsr * note.sinr, nsr * note.cosr, note.offsetX, note.offsetY);
	if (note.badtime);
	else {
		ctxos.globalAlpha = note.alpha || (note.showPoint && showPoint.checked ? 0.45 : 0);
		if (main.qwqwq) ctxos.globalAlpha *= Math.max(1 + (timeChart - note.realTime) / 1.5, 0);
		if (HL) ctxos.drawImage(res['DragHL'], -res['DragHL'].width * 0.5, -res['DragHL'].height * 0.5);
		else ctxos.drawImage(res['Drag'], -res['Drag'].width * 0.5, -res['Drag'].height * 0.5);
	}
}

function drawHold(note, realTime) {
	const HL = note.isMulti && app.multiHint;
	const nsr = app.noteScaleRatio;
	if (!note.visible || note.realTime + note.realHoldTime < realTime) return; //qwq
	ctxos.globalAlpha = note.alpha || (note.showPoint && showPoint.checked ? 0.45 : 0);
	if (main.qwqwq) ctxos.globalAlpha *= Math.max(1 + (timeChart - note.realTime) / 1.5, 0);
	ctxos.setTransform(nsr * note.cosr, nsr * note.sinr, -nsr * note.sinr, nsr * note.cosr, note.offsetX, note.offsetY);
	const baseLength = app.scaleY / nsr * note.speed * app.speed;
	const holdLength = baseLength * note.realHoldTime;
	if (note.realTime > realTime) {
		if (HL) {
			ctxos.drawImage(res['HoldHeadHL'], -res['HoldHeadHL'].width * 1.026 * 0.5, 0, res['HoldHeadHL'].width * 1.026, res['HoldHeadHL'].height * 1.026);
			ctxos.drawImage(res['HoldHL'], -res['HoldHL'].width * 1.026 * 0.5, -holdLength, res['HoldHL'].width * 1.026, holdLength);
		} else {
			ctxos.drawImage(res['HoldHead'], -res['HoldHead'].width * 0.5, 0);
			ctxos.drawImage(res['Hold'], -res['Hold'].width * 0.5, -holdLength, res['Hold'].width, holdLength);
		}
	} else {
		if (HL) ctxos.drawImage(res['HoldHL'], -res['HoldHL'].width * 1.026 * 0.5, -holdLength, res['HoldHL'].width * 1.026, holdLength - baseLength * (realTime - note.realTime));
		else ctxos.drawImage(res['Hold'], -res['Hold'].width * 0.5, -holdLength, res['Hold'].width, holdLength - baseLength * (realTime - note.realTime));
	}
	ctxos.drawImage(res['HoldEnd'], -res['HoldEnd'].width * 0.5, -holdLength - res['HoldEnd'].height);
}

function drawFlick(note) {
	const HL = note.isMulti && app.multiHint;
	const nsr = app.noteScaleRatio;
	if (!note.visible || note.scored && !note.badtime) return;
	ctxos.setTransform(nsr * note.cosr, nsr * note.sinr, -nsr * note.sinr, nsr * note.cosr, note.offsetX, note.offsetY);
	if (note.badtime);
	else {
		ctxos.globalAlpha = note.alpha || (note.showPoint && showPoint.checked ? 0.45 : 0);
		if (main.qwqwq) ctxos.globalAlpha *= Math.max(1 + (timeChart - note.realTime) / 1.5, 0);
		if (HL) ctxos.drawImage(res['FlickHL'], -res['FlickHL'].width * 0.5, -res['FlickHL'].height * 0.5);
		else ctxos.drawImage(res['Flick'], -res['Flick'].width * 0.5, -res['Flick'].height * 0.5);
	}
}
//调节画面尺寸和全屏相关(返回source播放aegleseeker会出现迷之error)
function adjustSize(source, dest, scale) {
	const { width: sw, height: sh } = source;
	const { width: dw, height: dh } = dest;
	if (dw * sh > dh * sw) return [dw * (1 - scale) / 2, (dh - dw * sh / sw * scale) / 2, dw * scale, dw * sh / sw * scale];
	return [(dw - dh * sw / sh * scale) / 2, dh * (1 - scale) / 2, dh * sw / sh * scale, dh * scale];
}
/**@type {Map<ImageBitmap,LineImage>} */
const lineImages = new Map;
class LineImage {
	/**@param {ImageBitmap} image */
	constructor(image) {
		this.image = image;
		this.imageFC = null;
		this.imageAP = null;
		this.imageMP = null;
	}
	async getFC() {
		if (!this.imageFC) this.imageFC = await imgShader(this.image, '#a2eeff');
		return this.imageFC;
	}
	async getAP() {
		if (!this.imageAP) this.imageAP = await imgShader(this.image, '#a3ffac');
		return this.imageAP;
	}
	async getMP() {
		if (!this.imageMP) this.imageMP = await imgShader(this.image, '#feffa9');
		return this.imageMP;
	}
}
/**
 * 图片模糊(StackBlur)
 * @param {ImageBitmap} img 
 */
function imgBlur(img) {
	const canvas = document.createElement('canvas');
	const w = canvas.width = img.width;
	const h = canvas.height = img.height;
	const ctx = canvas.getContext('2d');
	ctx.drawImage(img, 0, 0);
	StackBlur.canvasRGBA(canvas, 0, 0, w, h, Math.ceil(Math.min(w, h) * 0.0125));
	return createImageBitmap(canvas);
}
/**
 * 给图片上色(limit用于解决iOS的InvalidStateError)
 * @param {ImageBitmap} img 
 */
function imgShader(img, color, limit = 512) {
	const dataRGBA = hex2rgba(color);
	const canvas = document.createElement('canvas');
	canvas.width = img.width;
	canvas.height = img.height;
	const ctx = canvas.getContext('2d', { willReadFrequently: true }); //warning
	ctx.drawImage(img, 0, 0);
	for (let dx = 0; dx < img.width; dx += limit) {
		for (let dy = 0; dy < img.height; dy += limit) {
			const imgData = ctx.getImageData(dx, dy, limit, limit);
			for (let i = 0; i < imgData.data.length / 4; i++) {
				imgData.data[i * 4] *= dataRGBA[0] / 255;
				imgData.data[i * 4 + 1] *= dataRGBA[1] / 255;
				imgData.data[i * 4 + 2] *= dataRGBA[2] / 255;
				imgData.data[i * 4 + 3] *= dataRGBA[3] / 255;
			}
			ctx.putImageData(imgData, dx, dy);
		}
	}
	return createImageBitmap(canvas);
}
/**
 * 缁欏浘鐗囩函鑹�(limit鐢ㄤ簬瑙ｅ喅iOS鐨処nvalidStateError)
 * @param {ImageBitmap} img 
 */
function imgPainter(img, color, limit = 512) {
	const dataRGBA = hex2rgba(color);
	const canvas = document.createElement('canvas');
	canvas.width = img.width;
	canvas.height = img.height;
	const ctx = canvas.getContext('2d', { willReadFrequently: true }); //warning
	ctx.drawImage(img, 0, 0);
	for (let dx = 0; dx < img.width; dx += limit) {
		for (let dy = 0; dy < img.height; dy += limit) {
			const imgData = ctx.getImageData(dx, dy, limit, limit);
			for (let i = 0; i < imgData.data.length / 4; i++) {
				imgData.data[i * 4] = dataRGBA[0];
				imgData.data[i * 4 + 1] = dataRGBA[1];
				imgData.data[i * 4 + 2] = dataRGBA[2];
				imgData.data[i * 4 + 3] *= dataRGBA[3] / 255;
			}
			ctx.putImageData(imgData, dx, dy);
		}
	}
	return createImageBitmap(canvas);
}
/**
 * 切割图片
 * @param {ImageBitmap} img 
 * @param {number} [limitX]
 * @param {number} [limitY]
 */
function imgSplit(img, limitX, limitY) {
	limitX = parseInt(limitX) || Math.min(img.width, img.height);
	limitY = parseInt(limitY) || limitX;
	const arr = [];
	for (let dx = 0; dx < img.width; dx += limitX) {
		for (let dy = 0; dy < img.height; dy += limitY) {
			arr.push(createImageBitmap(img, dx, dy, limitX, limitY));
		}
	}
	return Promise.all(arr);
}
//十六进制color转rgba数组
function hex2rgba(color) {
	const ctx = document.createElement('canvas').getContext('2d');
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, 1, 1);
	return ctx.getImageData(0, 0, 1, 1).data;
}
//rgba数组(0-1)转十六进制
function rgba2hex(...rgba) {
	return '#' + rgba.map(i => ('00' + Math.round(Number(i) * 255 || 0).toString(16)).slice(-2)).join('');
}
//byte转人类可读
function bytefm(byte = 0) {
	if (byte < 1024) return `${byte}B`;
	byte /= 1024;
	if (byte < 1024) return `${byte.toFixed(2)}KB`;
	byte /= 1024;
	if (byte < 1024) return `${byte.toFixed(2)}MB`;
	byte /= 1024;
	if (byte < 1024) return `${byte.toFixed(2)}GB`;
	byte /= 1024;
	if (byte < 1024) return `${byte.toFixed(2)}TB`;
	byte /= 1024;
	if (byte < 1024) return `${byte.toFixed(2)}PB`;
	byte /= 1024;
	if (byte < 1024) return `${byte.toFixed(2)}EB`;
	byte /= 1024;
	if (byte < 1024) return `${byte.toFixed(2)}ZB`;
	byte /= 1024;
	if (byte < 1024) return `${byte.toFixed(2)}YB`;
	byte /= 1024;
	return `${byte}BB`;
}
//html交互(WIP)
class StatusManager {
	constructor(key) {
		this.key = key;
	}
	init(resetCallback) {
		this.data = JSON.parse(localStorage.getItem(this.key) || '{}');
		if (typeof resetCallback === 'function') resetCallback(this.data) && this.reset();
		return this;
	}
	save() {
		localStorage.setItem(this.key, JSON.stringify(this.data));
	}
	reset() {
		this.data = {};
		this.save();
	}
	get(key) {
		return this.data[key];
	}
	set(key, value) {
		this.data[key] = value;
		this.save();
	}
	reg(key, node) {
		if (node instanceof HTMLInputElement || node instanceof HTMLSelectElement) {
			const property = node.type === 'checkbox' ? 'checked' : 'value';
			const value = this.get(key);
			if (value !== undefined) node[property] = value;
			node.addEventListener('change', () => this.set(key, node[property]));
			node.dispatchEvent(new Event('change'));
		} else throw new Error('node must be a HTMLInputElement');
	}
}
class Checkbox {
	constructor(text, checked = false) {
		this.container = document.createElement('div');
		this.checkbox = document.createElement('input');
		this.checkbox.type = 'checkbox';
		this.checkbox.id = Utils.randomUUID();
		this.checkbox.checked = checked;
		this.label = document.createElement('label');
		this.label.htmlFor = this.checkbox.id;
		this.label.textContent = text;
		this.container.appendChild(this.checkbox);
		this.container.appendChild(this.label);
	}
	get checked() {
		return this.checkbox.checked;
	}
	set checked(value) {
		this.checkbox.checked = value;
		this.checkbox.dispatchEvent(new Event('change'));
	}
	appendTo(container) {
		container.appendChild(this.container);
		return this;
	}
	toggle() {
		this.checked = !this.checkbox.checked;
	}
	hook(callback = () => {}) {
		callback(this.checkbox);
		return this;
	}
}
$id('select-note-scale').addEventListener('change', evt => app.setNoteScale(evt.target.value));
$id('select-aspect-ratio').addEventListener('change', evt => stage.resize(evt.target.value));
$id('select-background-dim').addEventListener('change', evt => app.brightness = Number(evt.target.value));
$id('highLight').addEventListener('change', evt => app.multiHint = evt.target.checked);
const status = new StatusManager('sim-phi-status').init(data => data.resetCfg);
status.reg('feedback', $id('feedback'));
status.reg('imageBlur', $id('imageBlur'));
status.reg('highLight', $id('highLight'));
status.reg('lineColor', $id('lineColor'));
status.reg('autoplay', $id('autoplay'));
status.reg('showTransition', $id('showTransition'));
const showCE2 = new Checkbox('Early/Late特效').appendTo($id('view-cfg')).hook(status.reg.bind(status, 'showCE2'));
const showPoint = new Checkbox('显示定位点').appendTo($id('view-cfg')).hook(status.reg.bind(status, 'showPoint'));
const showAcc = new Checkbox('显示Acc').appendTo($id('view-cfg')).hook(status.reg.bind(status, 'showAcc'));
const showStat = new Checkbox('显示统计').appendTo($id('view-cfg')).hook(status.reg.bind(status, 'showStat'));
const lowRes = new Checkbox('低分辨率').appendTo($id('view-cfg')).hook(status.reg.bind(status, 'lowRes'));
const lockOri = new Checkbox('横屏锁定', true).appendTo($id('view-cfg')).hook(status.reg.bind(status, 'lockOri'));
const maxFrame = new Checkbox('限制帧率').appendTo($id('view-cfg')).hook(status.reg.bind(status, 'maxFrame'));
const autoDelay = new Checkbox('音画实时同步(若声音卡顿则建议关闭)', true).appendTo($id('view-cfg')).hook(status.reg.bind(status, 'autoDelay'));
const enableVP = new Checkbox('???').appendTo($id('view-cfg')).hook(status.reg.bind(status, 'enableVP'));
enableVP.checkbox.addEventListener('change', evt => app.enableVP = evt.target.checked);
const enableFR = new Checkbox('???').appendTo($id('view-cfg')).hook(status.reg.bind(status, 'enableFR'));
enableFR.checkbox.addEventListener('change', evt => app.enableFR = evt.target.checked);
const resetCfg = new Checkbox('恢复默认设置(刷新生效)').appendTo($id('view-cfg')).hook(status.reg.bind(status, 'resetCfg'));
const selectbg = $id('select-bg');
const btnPlay = $id('btn-play');
const btnPause = $id('btn-pause');
const selectbgm = $id('select-bgm');
const selectchart = $id('select-chart');
const selectflip = $id('select-flip');
selectflip.addEventListener('change', evt => app.mirrorView(evt.target.value));
status.reg('selectFlip', selectflip);
const selectspeed = $id('select-speed');
selectspeed.addEventListener('change', evt => {
	const dict = { Slowest: -9, Slower: -4, '': 0, Faster: 3, Fastest: 80 };
	app.speed = 2 ** (dict[evt.target.value] / 12);
});
status.reg('selectSpeed', selectspeed);
const inputName = $id('input-name');
const inputArtist = $id('input-artist');
const inputCharter = $id('input-charter');
const inputIllustrator = $id('input-illustrator');
const selectDifficulty = $id('select-difficulty');
const selectLevel = $id('select-level');
const updateLevelText = type => {
	const table = { SP: [0, 0], EZ: [1, 7], HD: [3, 12], IN: [6, 15], AT: [13, 16] };
	let diffStr = selectDifficulty.value || 'SP';
	let levelNum = selectLevel.value | 0;
	if (type === 0) {
		const diff = table[diffStr];
		if (levelNum < diff[0]) levelNum = diff[0];
		if (levelNum > diff[1]) levelNum = diff[1];
		selectLevel.value = levelNum;
		selectLevel.value = selectLevel.value;
	} else if (type === 1) {
		const keys = Object.keys(table);
		if (table[diffStr][1] < levelNum)
			for (let i = 0; i < keys.length; i++) {
				if (table[keys[i]][1] < levelNum) continue;
				diffStr = keys[i];
				break;
			}
		else if (table[diffStr][0] > levelNum) {
			for (let i = keys.length - 1; i >= 0; i--) {
				if (table[keys[i]][0] > levelNum) continue;
				diffStr = keys[i];
				break;
			}
		}
		selectDifficulty.value = diffStr;
		selectDifficulty.value = selectDifficulty.value;
	}
	const diffString = selectDifficulty.value || 'SP';
	const levelString = selectLevel.value || '?';
	return [diffString, levelString].join('  Lv.');
};
levelText = updateLevelText();
selectDifficulty.addEventListener('change', () => levelText = updateLevelText(0));
selectLevel.addEventListener('change', () => levelText = updateLevelText(1));
$id('select-volume').addEventListener('change', evt => {
	const volume = Number(evt.target.value);
	app.musicVolume = Math.min(1, 1 / volume);
	app.soundVolume = Math.min(1, volume);
	Promise.resolve().then(qwqPause).then(qwqPause);
});
status.reg('selectVolume', $id('select-volume'));
const inputOffset = $id('input-offset');
const lineColor = $id('lineColor');
$id('autoplay').addEventListener('change', evt => {
	app.playMode = evt.target.checked ? 1 : 0;
});
$id('autoplay').dispatchEvent(new Event('change'));
const showTransition = $id('showTransition');
lowRes.checkbox.addEventListener('change', evt => {
	app.setLowResFactor(evt.target.checked ? 0.5 : 1);
});
lowRes.checkbox.dispatchEvent(new Event('change'));
selectbg.onchange = () => { //qwq
	app.bgImage = bgs.get(selectbg.value);
	app.bgImageBlur = bgsBlur.get(selectbg.value);
	stage.resize();
}
selectchart.addEventListener('change', adjustInfo);
(function() {
	const input = document.createElement('input');
	Object.assign(input, { type: 'number', min: 25, max: 1000, value: 60 });
	input.style.cssText += ';width:50px;margin-left:10px';
	input.addEventListener('change', function() {
		if (this.value < 25) this.value = 25;
		if (this.value > 1000) this.value = 1000;
		frameAnimater.setFrameRate(this.value);
	});
	status.reg('maxFrameNumber', input);
	maxFrame.container.appendChild(input);
	maxFrame.checkbox.addEventListener('change', function() {
		input.classList.toggle('disabled', !this.checked);
		frameAnimater.setFrameRate(this.checked ? input.value : 0);
	});
	maxFrame.checkbox.dispatchEvent(new Event('change'));
})();
//play
emitter.addEventListener('change', /** @this {Emitter} */ function() {
	canvas.classList.toggle('fade', this.eq('stop'));
	$id('mask').classList.toggle('fade', this.ne('stop'));
	btnPlay.value = this.eq('stop') ? '播放' : '停止';
	btnPause.value = this.eq('pause') ? '继续' : '暂停';
	btnPause.classList.toggle('disabled', this.eq('stop'));
	for (const i of $$('.disabled-when-playing')) i.classList.toggle('disabled', this.ne('stop'));
	// console.log(this);
});
btnPlay.addEventListener('click', async function() {
	if (this.classList.contains('disabled')) return;
	this.classList.add('disabled');
	await qwqStop();
	this.classList.remove('disabled');
});
btnPause.addEventListener('click', async function() {
	if (this.classList.contains('disabled')) return;
	this.classList.add('disabled');
	await qwqPause();
	this.classList.remove('disabled');
});
inputOffset.addEventListener('input', function() {
	if (this.value < -400) this.value = -400;
	if (this.value > 600) this.value = 600;
});
status2.reg(emitter, 'change', _ => main.qwqwq ? 'Reversed' : ''); //qwq
status2.reg(selectflip, 'change', target => ['', 'FlipX', 'FlipY', 'FlipX&Y'][target.value]);
status2.reg(selectspeed, 'change', target => target.value);
status2.reg(emitter, 'change', ( /** @type {Emitter} */ target) => target.eq('pause') ? 'Paused' : '');
//plugin(phizone)
inputName.addEventListener('input', function() {
	if (this.value == '/pz') setTimeout(() => {
		if (this.value == '/pz') {
			import('./js/phizone.js?v=06').then(({ dialog }) => dialog());
			this.value = '';
			this.dispatchEvent(new Event('input'));
		}
	}, 1e3);
});
inputName.addEventListener('input', function() {
	if (this.value == '/random') setTimeout(() => {
		if (this.value == '/random') {
			import('./js/phizone.js?v=06').then(({ random }) => random());
			this.value = '';
			this.dispatchEvent(new Event('input'));
		}
	}, 1e3);
});
async function qwqStop() {
	if (emitter.eq('stop')) {
		if (!selectchart.value) return msgHandler.sendError('错误：未选择任何谱面');
		if (!selectbgm.value) return msgHandler.sendError('错误：未选择任何音乐');
		for (const kfc of main.kfcFkXqsVw50) await kfc();
		audio.play(res['mute'], { loop: true, isOut: false }); //播放空音频(防止音画不同步)
		app.prerenderChart(main.modify(charts.get(selectchart.value))); //fuckqwq
		app.md5 = chartsMD5.get(selectchart.value);
		stat.level = Number(levelText.match(/\d+$/));
		stat.reset(app.chart.numOfNotes, app.md5, selectspeed.value);
		await loadLineData();
		app.bgImage = bgs.get(selectbg.value) || res['NoImageWhite'];
		app.bgImageBlur = bgsBlur.get(selectbg.value) || res['NoImageWhite'];
		const bgm = bgms.get(selectbgm.value);
		app.bgMusic = bgm.audio;
		app.bgVideo = bgm.video;
		duration = app.bgMusic.duration / app.speed;
		isInEnd = false;
		isOutStart = false;
		isOutEnd = false;
		timeBgm = 0;
		if (!showTransition.checked) qwqIn.addTime(3e3);
		frameAnimater.start();
		qwqIn.play();
		interact.activate();
		emitter.emit('play');
	} else {
		emitter.emit('stop');
		interact.deactive();
		audio.stop();
		frameAnimater.stop();
		//清除原有数据
		fucktemp1 = false;
		fucktemp2 = false;
		hitFeedbackList.clear();
		hitImageList.clear();
		hitWordList.clear();
		qwqIn.reset();
		qwqOut.reset();
		qwqEnd.reset();
		curTime = 0;
		curTime_ms = 0;
		duration = 0;
	}
}
async function loadLineData() {
	for (const i of app.lines) {
		i.imageW = 6220.8; //1920
		i.imageH = 7.68; //3
		i.imageL = [res['JudgeLine'], res['JudgeLineMP'], null, res['JudgeLineFC']];
		i.imageS = 1; //2.56
		i.imageA = 1; //1.5625
		i.imageD = false;
		i.imageC = true;
		i.imageU = true;
	}
	for (const i of chartLineData) {
		if (selectchart.value === i.Chart) {
			if (!app.lines[i.LineId]) { msgHandler.sendWarning(`指定id的判定线不存在：${i.LineId}`); continue; }
			if (!bgs.has(i.Image)) msgHandler.sendWarning(`图片不存在：${i.Image}`);
			/** @type {ImageBitmap} */
			const image = bgs.get(i.Image) || res['NoImageBlack'];
			app.lines[i.LineId].imageW = image.width;
			app.lines[i.LineId].imageH = image.height;
			if (!lineImages.has(image)) lineImages.set(image, new LineImage(image));
			const lineImage = lineImages.get(image);
			app.lines[i.LineId].imageL = [image, await lineImage.getMP(), await lineImage.getAP(), await lineImage.getFC()];
			if (isFinite(i.Vert = parseFloat(i.Vert))) { //Legacy
				app.lines[i.LineId].imageS = Math.abs(i.Vert) * 1080 / image.height;
				app.lines[i.LineId].imageU = i.Vert > 0;
			}
			if (isFinite(i.Horz = parseFloat(i.Horz))) app.lines[i.LineId].imageA = i.Horz; //Legacy
			if (isFinite(i.IsDark = parseFloat(i.IsDark))) app.lines[i.LineId].imageD = !!i.IsDark; //Legacy
			if (isFinite(i.Scale = parseFloat(i.Scale))) app.lines[i.LineId].imageS = i.Scale;
			if (isFinite(i.Aspect = parseFloat(i.Aspect))) app.lines[i.LineId].imageA = i.Aspect;
			if (isFinite(i.UseBackgroundDim = parseFloat(i.UseBackgroundDim))) app.lines[i.LineId].imageD = !!i.UseBackgroundDim;
			if (isFinite(i.UseLineColor = parseFloat(i.UseLineColor))) app.lines[i.LineId].imageC = !!i.UseLineColor;
			if (isFinite(i.UseLineScale = parseFloat(i.UseLineScale))) app.lines[i.LineId].imageU = !!i.UseLineScale;
		}
	}
}
async function qwqPause() {
	if (emitter.eq('stop') || fucktemp1) return;
	if (emitter.eq('play')) {
		if (app.bgVideo) app.bgVideo.pause();
		qwqIn.pause();
		if (showTransition.checked && isOutStart) qwqOut.pause();
		curTime = timeBgm;
		audio.stop();
		emitter.emit('pause');
	} else {
		if (app.bgVideo) await playVideo(app.bgVideo, timeBgm * app.speed);
		qwqIn.play();
		if (showTransition.checked && isOutStart) qwqOut.play();
		if (isInEnd && !isOutStart) playBgm(app.bgMusic, timeBgm * app.speed);
		// console.log(app.bgVideo);
		emitter.emit('play');
	}
}
//plugin(tips)
function fireTip(html) {
	const cover = document.createElement('div');
	cover.classList.add('cover-dark', 'fade');
	const container = document.createElement('div');
	container.classList.add('cover-view', 'fade');
	const nav = document.createElement('div');
	nav.classList.add('view-nav');
	nav.innerHTML = `<p>Tip</p>`;
	const content = document.createElement('div');
	content.classList.add('view-content');
	content.innerHTML = html;
	container.append(nav, content);
	requestAnimationFrame(() => {
		$('.main').append(cover, container);
		requestAnimationFrame(() => {
			cover.classList.remove('fade');
			container.classList.remove('fade');
		});
	});
	cover.addEventListener('click', () => {
		cover.classList.add('fade');
		cover.addEventListener('transitionend', () => cover.remove());
		container.classList.add('fade');
		container.addEventListener('transitionend', () => container.remove());
	});
}
/**
 * @param {HTMLElement} elem 
 * @param {Function} activeFn 
 * @param {Function} doneFn 
 */
function longPress(elem, activeFn, doneFn, failFn) {
	let timer = null;
	elem.addEventListener('mousedown', onrequest);
	elem.addEventListener('mouseup', oncancel);
	elem.addEventListener('mouseleave', oncancel);
	elem.addEventListener('touchstart', onrequest, { passive: true });
	elem.addEventListener('touchend', oncancel);
	elem.addEventListener('touchcancel', oncancel);

	function onrequest() {
		timer = requestAnimationFrame(onrequest);
		if (activeFn()) {
			cancelAnimationFrame(timer);
			doneFn();
			elem.removeEventListener('mousedown', onrequest);
			elem.removeEventListener('mouseup', oncancel);
			elem.removeEventListener('mouseleave', oncancel);
			elem.removeEventListener('touchstart', onrequest);
			elem.removeEventListener('touchend', oncancel);
			elem.removeEventListener('touchcancel', oncancel);
		};
	}

	function oncancel() {
		cancelAnimationFrame(timer);
		failFn();
	}
}
(function helloworld() {
	let pressTime = null;
	longPress($('.title'), () => {
		if (pressTime === null) pressTime = performance.now();
		if (performance.now() - pressTime > 3473) return 1;
		return 0;
	}, () => {
		helloworld(!fireTip(`<p>${brain.getTip()}</p>`));
	}, () => pressTime = null);
})();
main.fireTip = fireTip;
main.stat = stat;
export var hook = self.hook = main;
//debug
main.app = app;
main.res = res;
main.audio = audio;
main.msgHandler = msgHandler;
main.frameAnimater = frameAnimater;
main.qwqEnd = qwqEnd;
main.bgms = bgms;
main.selectbgm = selectbgm;
main.selectchart = selectchart;
main.chartsMD5 = chartsMD5;
main.tmps = tmps;
main.qwq = qwq;
main.qwqwq = false;
Object.defineProperty(main, 'curTime', {
	get: () => curTime,
	set: (v) => curTime = v
})
const getFreq = () => { //progress变为频谱图
	const bufferLength = analyser.frequencyBinCount;
	const freq = new Uint8Array(bufferLength);
	analyser.getByteFrequencyData(freq);
	const avg = freq.reduce((a, b) => a + b) / bufferLength;
	return Math.min(1, avg / 255 * 2.15); //qwq
}

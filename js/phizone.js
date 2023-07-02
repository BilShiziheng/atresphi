import { uploader } from './reader.js';
const vtext = 'PhiZone API v0.6';
const vprompt = str => prompt(`${vtext}\n${str}`);
const valert = str => alert(`${vtext}\n${str}`);
async function query(id) {
	const response = await fetch(`https://api.phi.zone/songs/${id|0}/?query_charts=1`);
	if (!response.ok) {
		if (response.status === 404) return { charts: [] };
		throw `${response.status} ${response.statusText}`;
	}
	const song = await response.json();
	console.log(song);
	return getData(song.charts.filter(a => a.chart), song);
}
async function randomCore() {
	const response = await fetch(`https://api.phi.zone/charts/?pagination=0&query_charts=1`);
	if (!response.ok) {
		if (response.status === 404) return { charts: [] };
		throw `${response.status} ${response.statusText}`;
	}
	const data = await response.json();
	const charts = data.filter(a => a.chart).sort(_ => Math.random() - 0.5);
	const chart = charts[0];
	const song = await fetch(`https://api.phi.zone/songs/${chart.song}/`).then(res => res.json());
	return getData([chart], song);
}

function getData(base, song) {
	return {
		charts: base.map(a => ({
			id: a.id,
			chart: a.chart,
			level: `${a.level}  Lv.${a.difficulty | 0}`,
			charter: a.charter.replace(/\[PZUser:\d+:([^\]]+)\]/g, '$1'),
			assets: a.assets,
		})),
		composer: song.composer,
		illustration: song.illustration,
		illustrator: song.illustrator,
		name: song.name,
		song: song.song,
	};
}
export async function random() {
	const data = await randomCore().catch(err => valert(`无法连接至服务器\n错误代码：${err}`));
	console.log(data);
	if (!data) return;
	if (!data.charts.length) return valert(`歌曲ID ${id} 对应的谱面不存在`);
	await readData(data);
}
export async function dialog(num) {
	const id = num || vprompt('请输入歌曲ID');
	if (id === '' || id === null) return valert('未输入歌曲ID，已取消操作');
	const data = await query(id).catch(err => valert(`无法连接至服务器\n错误代码：${err}`));
	console.log(data);
	if (!data) return;
	if (!data.charts.length) return valert(`歌曲ID ${id} 对应的谱面不存在`);
	await readData(data);
}
async function readData(data) {
	const /** @type {array} */ charts = data.charts;
	const urls = [data.song, data.illustration];
	for (const chart of charts) {
		if (chart.chart) urls.push(chart.chart);
		if (chart.assets) urls.push(chart.assets);
	}
	const downloader = new Downloader();
	const dstr = str => decodeURIComponent(str.match(/[^/]+$/)[0]);
	await downloader.add(urls, ({ url, status, statusText }) => valert(`资源 '${dstr(url)}' 加载失败\n错误代码：${status} ${statusText}`));
	await downloader.start(uploader.onprogress);
	const xhr4 = async (url, name) => {
		const data = await downloader.getData(url);
		uploader.onload({ target: { result: data } }, { name }); //以后添加catch
	};
	await xhr4(data.song, dstr(data.song));
	await xhr4(data.illustration, dstr(data.illustration));
	for (let i = 0; i < charts.length; i++) {
		const chart = charts[i];
		if (chart.assets) await xhr4(chart.assets, dstr(chart.assets));
		await xhr4(chart.chart, dstr(chart.chart));
		const encoder = new TextEncoder();
		const offset = getOffset(chart.id);
		const infoText = `
			#
			Name: ${data.name}
			Song: ${dstr(data.song)}
			Picture: ${dstr(data.illustration)}
			Chart: ${dstr(chart.chart)}
			Level: ${chart.level}
			Composer: ${data.composer}
			Charter: ${chart.charter}
			Illustrator: ${data.illustrator}
			Offset: ${offset}
		`;
		const info = encoder.encode(infoText);
		uploader.onload({ target: { result: info.buffer } }, { name: 'info.txt' });
	}
}
/**
 * @typedef {(ev:ProgressEvent<XMLHttpRequest>)} XHR
 * @param {string} url
 * @param {XHR} onprogress
 */
function xhr2(url, onprogress = () => void 0) {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open('get', url, true);
		xhr.responseType = 'arraybuffer';
		xhr.onprogress = onprogress;
		xhr.onload = evt => (xhr.status === 200 ? resolve : reject)(evt);
		xhr.onerror = reject;
		xhr.send();
	});
}
async function getContentLength(url) {
	const res = await fetch(url, { method: 'HEAD' });
	const length = Number(res.headers.get('content-length')) || 0;
	if (res.ok && length) return length;
	const res2 = await fetch(url, { method: 'GET' });
	res2.body.cancel();
	if (!res2.ok) throw { url, status: res2.status, statusText: res2.statusText };
	return Number(res2.headers.get('content-length')) || 0;
}
class Downloader {
	constructor() {
		this.xhrs = Object.create(null);
	}
	async add(urls = [], onerror = () => void 0) {
		return Promise.all(urls.filter(url => !this.xhrs[url]).map(async url => {
			const total = await getContentLength(url).catch(err => (onerror(err), 0));
			this.xhrs[url] = { event: { loaded: 0, total } };
		}));
	}
	async start(onprogress = () => void 0) {
		const entries = Object.entries(this.xhrs);
		return Promise.all(entries.map(([url, xhr]) => xhr2(url, evt => {
			xhr.event = evt;
			onprogress({ loaded: this.loaded, total: this.total });
		}).then(evt => xhr.event = evt).catch(evt => xhr.event = evt)));
	}
	async getData(url) {
		const { event } = this.xhrs[url];
		if (event.loaded >= event.total) return event.target.response;
		throw new Error('未加载完成');
	}
	get loaded() {
		const values = Object.values(this.xhrs);
		return values.reduce((loaded, xhr) => loaded + xhr.event.loaded, 0);
	}
	get total() {
		const values = Object.values(this.xhrs);
		return values.reduce((total, xhr) => total + xhr.event.total, 0);
	}
}

function getOffset(id) {
	if (id === 29) return 200; //45
	if (id === 31) return 100; //24
	if (id === 38) return 175; //64
	if (id === 41) return 50; //43
	if (id === 42) return 175; //13
	if (id === 44) return -150; //33
	if (id === 54) return -500; //8
	if (id === 57) return 100; //52
	if (id === 59) return 50; //61
	if (id === 60) return 150; //74
	if (id === 63) return 175; //59
	if (id === 64) return 150; //55
	if (id === 65) return 250; //22-2
	if (id === 69) return -100; //68
	if (id === 71) return 50; //72
	if (id === 73) return 200; //69-1
	if (id === 74) return 300; //80
	if (id === 76) return -50; //89
	if (id === 77) return 300; //99
	if (id === 78) return 200; //69-2
	if (id === 80) return 200; //94
	if (id === 81) return 250; //97-1
	if (id === 84) return 250; //93
	if (id === 85) return 400; //91
	if (id === 87) return -50; //88
	if (id === 88) return 225; //102
	if (id === 90) return 200; //101-1
	if (id === 91) return 200; //101-2
	if (id === 93) return 200; //101-3
	if (id === 95) return 175; //21
	if (id === 100) return 150; //109
	if (id === 101) return -100; //108
	if (id === 102) return -200; //110
	if (id === 103) return -50; //112
	if (id === 105) return -400; //92
	if (id === 106) return 250; //97-2
	if (id === 107) return 150; //83
	if (id === 108) return 200; //113
	if (id === 110) return 150; //66
	if (id === 115) return 200; //122
	if (id === 119) return 100; //126
	if (id === 133) return -150; //129
	if (id === 134) return -100; //130
	// handled up to 138
	return 0;
}
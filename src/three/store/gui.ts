import GUI from 'lil-gui';
import { BoxState, LightState, VolumetricLightState } from './state';

export class GUIController {
	private static _instance: GUIController | null
	private _gui

	private constructor() {
		this._gui = new GUI()
	}

	static get instance() {
		if (!this._instance) {
			this._instance = new GUIController()
		}
		return this._instance
	}

	private _folder = (title: string) => {
		let folder = this._gui.folders.find(f => f._title === title)
		if (!folder) folder = this._gui.addFolder(title)
		return folder
	}

	private _uncontainedName = (folder: GUI, name: string) => {
		return !folder.controllers.find(c => c._name === name)
	}

	setBox = () => {
		const folder = this._folder('Instanced Box')

		const add = (name: string, param: [number, number, number]) => {
			this._uncontainedName(folder, name) && folder.add(BoxState, name, ...param)
		}

		add('x', [0.05, 1, 0.01])
		add('y', [0.05, 1, 0.01])
		add('z', [0.05, 1, 0.01])
	}

	setLight = () => {
		const folder = this._folder('Light')

		this._uncontainedName(folder, 'color') && folder.addColor(LightState, 'color')
	}

	setVolumetricLight = () => {
		const folder = this._folder('Post-processing')

		const add = (name: string, param?: [number, number, number]) => {
			if (param) {
				this._uncontainedName(folder, name) && folder.add(VolumetricLightState, name, ...param)
			} else {
				this._uncontainedName(folder, name) && folder.add(VolumetricLightState, name)
			}
		}

		add('enabled')
		add('exposure', [0, 1, 0.01])
		add('decay', [0, 1, 0.01])
		add('density', [0, 1, 0.01])
		add('weight', [0, 1, 0.01])
		add('samples', [10, 100, 10])
	}
}

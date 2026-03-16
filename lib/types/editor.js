/**
 * @typedef {"Desktop" | "Mobile" | "Tablet"} DeviceTypes
 */

/**
 * @typedef {Object} EditorElement
 * @property {string} id
 * @property {Object} styles
 * @property {string} name
 * @property {EditorBtns} type
 * @property {EditorElement[] | {
 *   href?: string;
 *   innerText?: string;
 *   src?: string;
 *   formTitle?: string;
 *   formDescription?: string;
 *   formButton?: string;
 *   alt?: string;
 * }} content
 */

/**
 * @typedef {Object} Editor
 * @property {string} funnelPageId
 * @property {boolean} liveMode
 * @property {EditorElement[]} elements
 * @property {EditorElement} selectedElement
 * @property {DeviceTypes} device
 * @property {boolean} previewMode
 */

/**
 * @typedef {Object} HistoryState
 * @property {number} currentIndex
 * @property {Editor[]} history
 */

/**
 * @typedef {Object} EditorState
 * @property {Editor} editor
 * @property {HistoryState} history
 */

/**
 * @typedef {"text"
 * | "container"
 * | "section"
 * | "contactForm"
 * | "paymentForm"
 * | "link"
 * | "2Col"
 * | "video"
 * | "__body"
 * | "image"
 * | "3Col"
 * | null} EditorBtns
 */

/**
 * @typedef {(
 *  | {
 *      type: "ADD_ELEMENT";
 *      payload: {
 *        containerId: string;
 *        elementDetails: EditorElement;
 *      };
 *    }
 *  | {
 *      type: "UPDATE_ELEMENT";
 *      payload: {
 *        elementDetails: EditorElement;
 *      };
 *    }
 *  | {
 *      type: "DELETE_ELEMENT";
 *      payload: {
 *        elementDetails: EditorElement;
 *      };
 *    }
 *  | {
 *      type: "CHANGE_CLICKED_ELEMENT";
 *      payload: {
 *        elementDetails?:
 *          | EditorElement
 *          | {
 *              id: "";
 *              content: [];
 *              name: "";
 *              styles: {};
 *              type: null;
 *            };
 *      };
 *    }
 *  | {
 *      type: "CHANGE_DEVICE";
 *      payload: {
 *        device: DeviceTypes;
 *      };
 *    }
 *  | {
 *      type: "TOGGLE_PREVIEW_MODE";
 *    }
 *  | {
 *      type: "TOGGLE_LIVE_MODE";
 *      payload?: {
 *        value: boolean;
 *      };
 *    }
 *  | { type: "REDO" }
 *  | { type: "UNDO" }
 *  | {
 *      type: "LOAD_DATA";
 *      payload: {
 *        elements: EditorElement[];
 *        withLive: boolean;
 *      };
 *    }
 *  | {
 *      type: "CLEAR_HISTORY";
 *    }
 *  | {
 *      type: "SET_FUNNELPAGE_ID";
 *      payload: {
 *        funnelPageId: string;
 *      };
 *    }
 * )} EditorAction
 */

export {};

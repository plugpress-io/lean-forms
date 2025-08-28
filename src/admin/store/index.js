/**
 * Lean Forms Admin Store
 * WordPress Data Store for managing admin state
 */

import { createReduxStore, register } from "@wordpress/data";
import apiFetch from "@wordpress/api-fetch";

const DEFAULT_STATE = {
  // Current navigation
  currentView: "dashboard",

  // Settings
  settings: {},
  settingsLoading: false,
  settingsSaving: false,

  // Entries
  entries: [],
  entriesLoading: false,
  entriesTotal: 0,
  entriesFilters: {
    search: "",
    status: "",
    form_id: "",
    date_min: "",
    date_max: "",
  },
  entriesPagination: {
    currentPage: 1,
    perPage: 20,
  },

  // Forms
  forms: [],

  // UI State
  notices: [],
  modals: {
    entryDetail: {
      isOpen: false,
      entry: null,
    },
  },
};

const actions = {
  // Navigation
  setCurrentView(view) {
    return {
      type: "SET_CURRENT_VIEW",
      view,
    };
  },

  // Settings
  setSettings(settings) {
    return {
      type: "SET_SETTINGS",
      settings,
    };
  },

  setSettingsLoading(loading) {
    return {
      type: "SET_SETTINGS_LOADING",
      loading,
    };
  },

  setSettingsSaving(saving) {
    return {
      type: "SET_SETTINGS_SAVING",
      saving,
    };
  },

  updateSetting(key, value) {
    return {
      type: "UPDATE_SETTING",
      key,
      value,
    };
  },

  // Async action to fetch settings
  *fetchSettings() {
    yield actions.setSettingsLoading(true);

    try {
      const settings = yield apiFetch({
        path: "/lean-forms/v1/settings",
        method: "GET",
      });

      yield actions.setSettings(settings || {});
    } catch (error) {
      console.error("Error fetching settings:", error);
      yield actions.setSettings({});
    } finally {
      yield actions.setSettingsLoading(false);
    }
  },

  // Entries
  setEntries(entries, total = 0) {
    return {
      type: "SET_ENTRIES",
      entries,
      total,
    };
  },

  setEntriesLoading(loading) {
    return {
      type: "SET_ENTRIES_LOADING",
      loading,
    };
  },

  setEntriesFilters(filters) {
    return {
      type: "SET_ENTRIES_FILTERS",
      filters,
    };
  },

  setEntriesPagination(pagination) {
    return {
      type: "SET_ENTRIES_PAGINATION",
      pagination,
    };
  },

  updateEntry(entryId, updates) {
    return {
      type: "UPDATE_ENTRY",
      entryId,
      updates,
    };
  },

  removeEntry(entryId) {
    return {
      type: "REMOVE_ENTRY",
      entryId,
    };
  },

  // Forms
  setForms(forms) {
    return {
      type: "SET_FORMS",
      forms,
    };
  },

  // UI
  addNotice(notice) {
    return {
      type: "ADD_NOTICE",
      notice: {
        id: Date.now(),
        ...notice,
      },
    };
  },

  removeNotice(noticeId) {
    return {
      type: "REMOVE_NOTICE",
      noticeId,
    };
  },

  openEntryModal(entry) {
    return {
      type: "OPEN_ENTRY_MODAL",
      entry,
    };
  },

  closeEntryModal() {
    return {
      type: "CLOSE_ENTRY_MODAL",
    };
  },
};

const selectors = {
  // Navigation
  getCurrentView(state) {
    return state.currentView;
  },

  // Settings
  getSettings(state) {
    return state.settings;
  },

  getSetting(state, key) {
    return state.settings[key];
  },

  isSettingsLoading(state) {
    return state.settingsLoading;
  },

  isSettingsSaving(state) {
    return state.settingsSaving;
  },

  // Entries
  getEntries(state) {
    return state.entries;
  },

  getEntriesTotal(state) {
    return state.entriesTotal;
  },

  isEntriesLoading(state) {
    return state.entriesLoading;
  },

  getEntriesFilters(state) {
    return state.entriesFilters;
  },

  getEntriesPagination(state) {
    return state.entriesPagination;
  },

  getEntry(state, entryId) {
    return state.entries.find((entry) => entry.id === entryId);
  },

  // Forms
  getForms(state) {
    return state.forms;
  },

  getForm(state, formId) {
    return state.forms.find((form) => form.id === formId);
  },

  // UI
  getNotices(state) {
    return state.notices;
  },

  getEntryModal(state) {
    return state.modals.entryDetail;
  },
};

const reducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case "SET_CURRENT_VIEW":
      return {
        ...state,
        currentView: action.view,
      };

    case "SET_SETTINGS":
      return {
        ...state,
        settings: action.settings,
      };

    case "SET_SETTINGS_LOADING":
      return {
        ...state,
        settingsLoading: action.loading,
      };

    case "SET_SETTINGS_SAVING":
      return {
        ...state,
        settingsSaving: action.saving,
      };

    case "UPDATE_SETTING":
      return {
        ...state,
        settings: {
          ...state.settings,
          [action.key]: action.value,
        },
      };

    case "SET_ENTRIES":
      return {
        ...state,
        entries: action.entries,
        entriesTotal: action.total,
      };

    case "SET_ENTRIES_LOADING":
      return {
        ...state,
        entriesLoading: action.loading,
      };

    case "SET_ENTRIES_FILTERS":
      return {
        ...state,
        entriesFilters: {
          ...state.entriesFilters,
          ...action.filters,
        },
      };

    case "SET_ENTRIES_PAGINATION":
      return {
        ...state,
        entriesPagination: {
          ...state.entriesPagination,
          ...action.pagination,
        },
      };

    case "UPDATE_ENTRY":
      return {
        ...state,
        entries: state.entries.map((entry) =>
          entry.id === action.entryId ? { ...entry, ...action.updates } : entry,
        ),
      };

    case "REMOVE_ENTRY":
      return {
        ...state,
        entries: state.entries.filter((entry) => entry.id !== action.entryId),
        entriesTotal: state.entriesTotal - 1,
      };

    case "SET_FORMS":
      return {
        ...state,
        forms: action.forms,
      };

    case "ADD_NOTICE":
      return {
        ...state,
        notices: [...state.notices, action.notice],
      };

    case "REMOVE_NOTICE":
      return {
        ...state,
        notices: state.notices.filter(
          (notice) => notice.id !== action.noticeId,
        ),
      };

    case "OPEN_ENTRY_MODAL":
      return {
        ...state,
        modals: {
          ...state.modals,
          entryDetail: {
            isOpen: true,
            entry: action.entry,
          },
        },
      };

    case "CLOSE_ENTRY_MODAL":
      return {
        ...state,
        modals: {
          ...state.modals,
          entryDetail: {
            isOpen: false,
            entry: null,
          },
        },
      };

    default:
      return state;
  }
};

const store = createReduxStore("lean-forms/admin", {
  reducer,
  actions,
  selectors,
});

register(store);

export default store;

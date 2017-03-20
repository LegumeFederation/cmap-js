src/state/ contains singleton objects which represent shared state.

For example UI components in Mithril should not contain their state internally
because that may prevent component re-usability. Instead multiple components can
share the same state which is the canonical source of state.

Similarly the UI layer and the Canvas layer may need to have some shared state,
e.g. current tool mode or current selection set, etc.

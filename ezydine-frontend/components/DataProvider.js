import { createContext, useContext } from 'react'

// Create Context object.
const DataContext = createContext()

// Export Provider.
export function DataProvider(props) {
	const {value, children} = props

	return (
	   <DataContext.Provider value={value}>
		{children}
	   </DataContext.Provider>
	)
}

// Export useContext Hook.
export function useDataContext() {
	return useContext(DataContext);
}

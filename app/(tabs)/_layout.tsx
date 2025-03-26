import { Tabs } from 'expo-router';

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
			}}
		>
			<Tabs.Screen name="PlayerList" />
			<Tabs.Screen name="Albums" />
			{/* <Tabs.Screen name="Search" /> */}
			<Tabs.Screen name="About" />
		</Tabs>
	);
}

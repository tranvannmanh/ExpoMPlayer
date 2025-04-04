import { IconBookshelf, IconDotsHorizontal, IconMusic } from '@/assets/icons';
import { Tabs } from 'expo-router';
import { Pressable } from 'react-native';

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: '#000000',
				tabBarStyle: {
					minHeight: 60,
				},
				tabBarLabelStyle: {
					fontSize: 12,
				},
				tabBarButton: (props) => (
					<Pressable {...props} android_ripple={{ color: undefined }} />
				),
			}}
		>
			<Tabs.Screen
				name="PlayerList"
				options={{
					tabBarIcon: ({ color }) => <IconMusic color={color} />,
					tabBarLabel: 'Playlist',
				}}
			/>
			<Tabs.Screen
				name="Albums"
				options={{
					tabBarIcon: ({ color }) => <IconBookshelf color={color} />,
					tabBarLabel: 'Albums',
				}}
			/>
			<Tabs.Screen
				name="About"
				options={{
					tabBarLabel: 'Others',
					tabBarIcon: ({ color }) => <IconDotsHorizontal color={color} />,
				}}
			/>
		</Tabs>
	);
}

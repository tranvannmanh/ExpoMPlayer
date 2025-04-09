import TracksProvider from '@/context/player-context';
import { Stack } from 'expo-router';
import { useMemo } from 'react';

export default function RootLayout() {
	const stackRoutes = useMemo(
		() => (
			<Stack
				initialRouteName="(tabs)"
				screenOptions={{
					headerShown: false,
				}}
			>
				<Stack.Screen name="(tabs)" />
				<Stack.Screen
					name="PlayingTrackDetail"
					options={{
						animation: 'fade_from_bottom',
					}}
				/>
			</Stack>
		),
		[]
	);
	return <TracksProvider>{stackRoutes}</TracksProvider>;
}

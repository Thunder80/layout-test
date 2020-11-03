import React, { useEffect, useRef, useState } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import "./App.css";

function App() {
	const [items, setItems] = useState<number[]>([1, 2, 3, 4, 5]);
	const [videoItems, setVideoItems] = useState<MediaStream[]>([]);
	const [layout, setLayout] = useState<Layout[]>([]);
	const [stream, setStream] = useState<MediaStream | null>(null);
	const Video = ({ stream }: { stream: MediaStream | null }) => {
		const ref = useRef<HTMLVideoElement>(null);
		useEffect(() => {
			if (ref.current) ref.current.srcObject = stream;
		}, []);
		return (
			<video
				style={{
					position: "absolute",
					right: 0,
					bottom: 0,
					minWidth: "100%",
					maxHeight: "100%",
					width: "auto",
					height: "auto",
					zIndex: -100,
					backgroundSize: "cover",
					overflow: "hidden"
				}}
				autoPlay={true}
				ref={ref}
			></video>
		);
	};

	const fixLayout = (layout: Layout[]) => {
		const maxY = 2;

		const maxRowXs = layout
			.map((item: any) => (item.y === maxY ? item.x : null))
			.filter((value: any) => value !== null);
		const xs = [0, 1, 2];

		const missingX = xs.find((value: any) =>
			maxRowXs.every((maxRowX: number) => maxRowX !== value)
		);
		const fixedLayout = layout.map((item: any) => {
			if (item.y > maxY) {
				return {
					...item,
					y: maxY,
					x: missingX
				};
			}
			return item;
		});
		return fixedLayout;
	};

	useEffect(() => {
		console.log(items);
		const newLayout = items.map((e, i) => {
			return {
				i: i + "",
				x: Math.floor(i % 3),
				y: Math.floor(i / 3),
				w: 1,
				h: 1
			};
		});
		console.log(newLayout);
		setLayout(newLayout);
	}, [items]);

	useEffect(() => {
		navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
			setStream(stream);
			setVideoItems([...videoItems, stream]);
		});
	}, []);
	return (
		<>
			<button onClick={() => setVideoItems([...videoItems, stream!])}>
				Add
			</button>
			<button
				onClick={() =>
					setItems(items.filter((item) => item !== items.length))
				}
			>
				Remove
			</button>
			<GridLayout
				className="layout"
				layout={layout}
				cols={3}
				rowHeight={150}
				width={1000}
				onLayoutChange={(layout) => {
					const fixedLayout = fixLayout(layout);
					console.log("NEW LAYOUT", layout);
					console.log("FIXED LAYOUT", fixedLayout);
					setLayout(fixedLayout);
				}}
			>
				{videoItems.map((e, i) => {
					return (
						<div style={{ backgroundColor: "red" }} key={i}>
							<Video stream={stream} />
						</div>
					);
				})}
			</GridLayout>
		</>
	);
}

export default App;

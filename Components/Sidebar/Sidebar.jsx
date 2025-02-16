
// import React, { useState } from "react";
// import Style from "./Sidebar.module.css";

// const Sidebar = () => {
// 	const [activeItem, setActiveItem] = useState(null);

// 	const menuItems = [
// 		"Technology",
// 		"Lifestyle",
// 		"Finance",
// 		"Health",
// 		"Entertainment",
// 		"Others",
// 	];

// 	return (
// 		<div className={Style.sidecontainer}>
// 			<div>
// 				<button className={Style.addBlogBtn}>Add Blog</button>
// 			</div>
// 			<div className={Style.menuList}>
// 				{menuItems.map((item, index) => (
// 					<div
// 						key={index}
// 						className={`${Style.menuItem} ${
// 							activeItem === item ? Style.activeItem : ""
// 						}`}
// 						onClick={() => setActiveItem(item)}
// 					>
// 						{item}
// 					</div>
// 				))}
// 			</div>
// 		</div>
// 	);
// };

// export default Sidebar;


import React, { useState } from "react";
import Style from "./Sidebar.module.css";
import { useRouter } from "next/router";

const Sidebar = () => {
	const [activeItems, setActiveItems] = useState([]);

	const router = useRouter();

	const handleClick = () => {
		router.push({
			pathname: "blog"
		});
	};

	const menuItems = [
		"Technology",
		"Lifestyle",
		"Finance",
		"Health",
		"Entertainment",
		"Others",
	];

	const toggleItem = (item) => {
		setActiveItems((prev) =>
			prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
		);
	};

	return (
		<div className={Style.sidecontainer}>
			<div>
				<button onClick={handleClick} className={Style.addBlogBtn}>Add Blog</button>
			</div>
			<div className={Style.menu}>
				<div className={Style.menuList}>
					{menuItems.map((item, index) => (
						<div
							key={index}
							className={`${Style.menuItem} ${
								activeItems.includes(item) ? Style.activeItem : ""
							}`}
							onClick={() => toggleItem(item)}
						>
							{item}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Sidebar;

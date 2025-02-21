import React, { useEffect, useState, useContext } from "react";
import Image from "next/image";
import Link from "next/link";

//INTERNAL IMPORT
import Style from "./NavBar.module.css";
import { ChatAppContext } from "../../Context/ChatAppContext";
import { Model, Error, Land } from "../index";
import images from "../../assets";

const NavBar = () => {
  const menuItems = [
    // {
    //   menu: "ALL USERS",
    //   link: "alluser",
    // },
    // {
    //   menu: "FEED",
    //   link: "feed",
    // },
    // {
    //   menu: "CHAT",
    //   link: "/",
    // },
    
  
  ];

  //USESTATE
  const [active, setActive] = useState(3);
  const [open, setOpen] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const [land, setLand] = useState(true);

  const { account, userName, connectWallet, createAccount, error } =
    useContext(ChatAppContext);
  return (
		<div className={Style.NavBar}>
			<div className={Style.NavBar_box}>
				<div className={Style.NavBar_box_left}>
					<Image
						className={Style.Navbar_logo}
						src={images.logo}
						alt="logo"
						width={120}
						height={120}
					/>
				</div>
				<div className={Style.NavBar_box_right}>
					{/* //DESKTOP */}
					{/* <div className={Style.NavBar_box_right_menu}>
						{menuItems.map((el, i) => (
							<div
								onClick={() => setActive(i + 1)}
								key={i + 1}
								className={`${Style.NavBar_box_right_menu_items} ${
									active == i + 1 ? Style.active_btn : ""
								}`}
							>
								<Link
									className={Style.NavBar_box_right_menu_items_link}
									href={el.link}
								>
									{el.menu}
								</Link>
							</div>
						))}
					</div> */}

					{/* //MOBILE */}
					{open && (
						<div className={Style.mobile_menu}>
							{menuItems.map((el, i) => (
								<div
									onClick={() => setActive(i + 1)}
									key={i + 1}
									className={`${Style.mobile_menu_items} ${
										active == i + 1 ? Style.active_btn : ""
									}`}
								>
									<Link className={Style.mobile_menu_items_link} href={el.link}>
										{el.menu}
									</Link>
								</div>
							))}

							<p className={Style.mobile_menu_btn}>
								<Image
									src={images.close}
									alt="close"
									width={50}
									height={50}
									onClick={() => setOpen(false)}
								/>
							</p>
						</div>
					)}

					{/* CONNECT WALLET */}
					<div className={Style.NavBar_box_right_connect}>
						{account == "" ? (
							<button onClick={() => connectWallet()}>
								{""}
								<span>Connect Wallet</span>
							</button>
						) : (
							<button onClick={() => setOpenModel(true)}>
								{""}
								<div className={Style.person}>
									<Image
										src={userName ? images.accountName : images.create2}
										alt="Account image"
										width={35}
										height={35}
									/>
								</div>
								{""}
								<small>{userName || "Create Account"}</small>
							</button>
						)}
					</div>

					<div
						className={Style.NavBar_box_right_open}
						onClick={() => setOpen(true)}
					>
						<Image src={images.open} alt="open" width={30} height={30} />
					</div>
				</div>
			</div>

			{/* MODEL COMPONENT */}
			{openModel && (
				<div className={Style.modelBox}>
					<Model
						openBox={setOpenModel}
						title="WELCOME TO"
						head="D - CONNECT"
						info="We help you to connect with the friends and family in a secure way"
						smallInfo="Kindly Enter your username"
						image={images.hero}
						functionName={createAccount}
						address={account}
					/>
				</div>
			)}
			{error == "" ? "" : <Error error={error} />}
		</div>
	);
};

export default NavBar;

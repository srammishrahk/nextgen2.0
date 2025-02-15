// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract BlogApp {
    enum BlogCategory {
        Technology,
        Lifestyle,
        Finance,
        Health,
        Entertainment,
        Others
    }

    // User Structure
    struct User {
        string name;
        string profileImageHashcode;
        BlogCategory[] preferences;
    }

    struct friend {
        address payable pubkey;
        string name;
    }

    struct message {
        address payable sender;
        uint256 timestamp;
        string msg;
    }

    struct AllUserStruct {
        string name;
        string profileImageHashcode;
        address payable accountAddress;
    }

    AllUserStruct[] public getAllUsers;

    uint public imageCount = 0;
    mapping(address => User) public userList;
    mapping(uint => Image) public images;

    struct Image {
        uint id;
        string hash;
        string description;
        uint tipAmount;
        address payable author;
    }

    event ImageCreated(
        uint id,
        string hash,
        string description,
        uint tipAmount,
        address payable author
    );

    event ImageTipped(
        uint id,
        string hash,
        string description,
        uint tipAmount,
        address payable author
    );

    mapping(bytes32 => message[]) allMessages;

    //CHECK USER EXIST
    function checkUserExists(
        address payable pubkey
    ) public view returns (bool) {
        return bytes(userList[pubkey].name).length > 0;
    }

    //CREATE ACCOUNT
    // User Management Functions
    function createAccount(string memory name, string memory profileHash, BlogCategory[] memory preferences) public {
        require(bytes(userList[msg.sender].name).length == 0, "User exists");
        require(bytes(name).length > 0, "Name required");

        userList[msg.sender] = User({
            name: name,
            profileImageHashcode: profileHash,
            preferences: preferences
        });

        getAllUsers.push(AllUserStruct(name, profileHash, payable(msg.sender)));
    }

    //GET USERNAME
    function getUsername(
        address payable pubkey
    ) external view returns (string memory) {
        require(checkUserExists(payable(pubkey)), "User is not registered");
        return userList[pubkey].name;
    }


    //get chat code
    function _getChatCode(
        address payable pubkey1,
        address payable pubkey2
    ) internal pure returns (bytes32) {
        if (pubkey1 < pubkey2) {
            return keccak256(abi.encodePacked(pubkey1, pubkey2));
        } else return keccak256(abi.encodePacked(pubkey2, pubkey1));
    }

    //READ MESSAGE
    function readMessage(
        address friend_key
    ) external view returns (message[] memory) {
        bytes32 chatCode = _getChatCode(
            payable(msg.sender),
            payable(friend_key)
        );
        return allMessages[chatCode];
    }

    function getAllAppUser() public view returns (AllUserStruct[] memory) {
        return getAllUsers;
    }

    //Create images
    function uploadImage(
        string memory _imgHash,
        string memory _description
    ) public {
        //Make sure image hash exists
        require(bytes(_imgHash).length > 0);
        //Make sure image description exists
        require(bytes(_description).length > 0);
        //Make sure uploader address exists
        require(msg.sender != address(0x0));
        //Increment image id
        imageCount++;
        //Add image to contract
        images[imageCount] = Image(
            imageCount,
            _imgHash,
            _description,
            0,
            payable(msg.sender)
        );
        //Tigger an event
        emit ImageCreated(
            imageCount,
            _imgHash,
            _description,
            0,
            payable(msg.sender)
        );
    }

    //Tip images
    function tipImageOwner(uint _id) public payable {
        // Make sure the id is valid
        require(_id > 0 && _id <= imageCount);
        // Fetch the image
        Image memory _image = images[_id];
        // Fetch the author
        address payable _author = _image.author;
        // Pay the author by sending them Ether
        _author.transfer(5 ether);
        // Increment the tip amount
        _image.tipAmount = _image.tipAmount + 5 ether;
        // Update the image
        images[_id] = _image;
        // Trigger an event
        emit ImageTipped(
            _id,
            _image.hash,
            _image.description,
            _image.tipAmount,
            _author
        );
    }
}

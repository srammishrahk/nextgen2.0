

// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract ChatApp{

    //USER STRUCT
    struct user{
        string name;
        friend[] friendList;
    }

    struct friend{
        address payable pubkey;
        string name;
    }

    struct message{
        address payable sender;
        uint256 timestamp;
        string msg;
    }

    struct AllUserStruck{
        string name;
        address payable accountAddress;
    }

    AllUserStruck[] getAllUsers;

    uint public imageCount = 0;
    mapping(uint => Image) public images;

    struct Image{
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

    

    mapping(address  => user) userList;
    mapping(bytes32 => message[]) allMessages;

    //CHECK USER EXIST
    function checkUserExists(address payable pubkey) public view returns(bool){
        return bytes(userList[pubkey].name).length > 0;
    }

    //CREATE ACCOUNT
    function createAccount(string calldata name) external {
        require(checkUserExists(payable(msg.sender)) == false, "User already exists");
        require(bytes(name).length>0, "Username cannot be empty");

        userList[msg.sender].name = name;

        getAllUsers.push(AllUserStruck(name, payable(msg.sender)));
    }

    //GET USERNAME
    function getUsername(address payable pubkey) external view returns(string memory){
        require(checkUserExists(payable(pubkey)), "User is not registered");
        return userList[pubkey].name;
    }

    //ADD FRIENDS
    function addFriend(address payable friend_key, string calldata name) external{
        require(checkUserExists(payable(msg.sender)), "Create an account first");
        require(checkUserExists(payable(friend_key)), "User is not registered!");
        require(msg.sender != friend_key, "Users cannot add themeselves as friends");
        require(checkAlreadyFriends(payable(msg.sender), payable(friend_key))== false, "These users are already friends");

        _addFriend(payable(msg.sender), payable(friend_key), name);
        _addFriend(payable(friend_key), payable(msg.sender), userList[msg.sender].name);
    }

    //checkAlreadyFriends
    function checkAlreadyFriends(address payable pubkey1, address payable pubkey2) internal view returns (bool){

        if(userList[pubkey1].friendList.length > userList[pubkey2].friendList.length){
            address payable tmp = pubkey1;
            pubkey1 = pubkey2;
            pubkey2 = tmp;
        }

        for(uint256 i = 0; i < userList[pubkey1].friendList.length; i++){
            
            if(userList[pubkey1].friendList[i].pubkey == pubkey2) return true;
        }
        return false;
    }

    function _addFriend(address payable me, address payable friend_key, string memory name) internal{
        friend memory newFriend = friend(payable(friend_key), name);
       userList[me].friendList.push(newFriend);
    }

    //GETMY FRIEND
    function getMyFriendList() external view returns(friend[] memory){
        return userList[msg.sender].friendList;
    }

    //get chat code
    function _getChatCode(address payable pubkey1, address payable pubkey2) internal pure returns(bytes32){
        if(pubkey1 < pubkey2){
            return keccak256(abi.encodePacked(pubkey1, pubkey2));
        } else 
        return keccak256(abi.encodePacked(pubkey2, pubkey1));
    }

    //SEND MESSAGE
    function sendMessage(address payable friend_key, string calldata _msg) external{
        require(checkUserExists(payable(msg.sender)), "Create an account first");
        require(checkUserExists(payable(friend_key)), "User is not registered");
        require(checkAlreadyFriends(payable(msg.sender), payable(friend_key)), "You are not friend with the given user");

        bytes32 chatCode = _getChatCode(payable(msg.sender), payable(friend_key));
        message memory newMsg = message(payable(msg.sender), block.timestamp, _msg);
        allMessages[chatCode].push(newMsg);
    }

    //READ MESSAGE
    function readMessage(address friend_key) external view returns(message[] memory){
        bytes32 chatCode = _getChatCode(payable(msg.sender), payable(friend_key));
        return allMessages[chatCode];
    }

    function getAllAppUser() public view returns(AllUserStruck[] memory){
        return getAllUsers;
    }


    //Create images
    function uploadImage(string memory _imgHash, string memory _description) public{
        //Make sure image hash exists
        require(bytes(_imgHash).length > 0);
        //Make sure image description exists
        require(bytes(_description).length > 0);
        //Make sure uploader address exists
        require(msg.sender != address(0x0)); 
        //Increment image id
        imageCount++;
        //Add image to contract
        images[imageCount] = Image(imageCount,_imgHash,_description,0,payable(msg.sender));
        //Tigger an event
        emit ImageCreated(imageCount,_imgHash,_description,0,payable(msg.sender));
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
        emit ImageTipped(_id, _image.hash, _image.description, _image.tipAmount, _author);
    }

}
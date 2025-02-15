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

    // Blog Structure
    struct Blog {
        uint id;
        string contentHash;
        string blogCoverHash;
        uint tipAmount;
        BlogCategory category;
        address payable author;
        uint createdAt;
        address[] selectedUsers;
        uint approveVotes;
        uint rejectVotes;
        bool isBlocked;
        bool isApproved;
    }

    // Comment Structure
    struct Comment {
        address payable sender;
        uint256 timestamp;
        string text;
    }

    struct AllUserStruct {
        string name;
        string profileImageHashcode;
        address payable accountAddress;
    }

    AllUserStruct[] public getAllUsers;

    uint public blogCount = 0;
    mapping(uint => Blog) public blogs;
    mapping(address => User) public userList;
    mapping(uint => Comment[]) public blogComments;
    mapping(uint => mapping(address => bool)) public hasVoted;

    // Events
    event BlogCreated(
        uint id,
        string contentHash,
        string blogCoverHash,
        string title,
        BlogCategory category,
        address payable author
    );

    event BlogTipped(
        uint id,
        string title,
        uint tipAmount,
        address payable author
    );

    event CommentAdded(uint blogId, address sender, string comment);

    event BlogVoted(uint blogId, address voter, bool approved);

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


    function createBlog(
        string memory contentHash,
        string memory blogCoverHash,
        string memory title,
        BlogCategory category
    ) public {
        require(bytes(contentHash).length > 0, "Content required");
        require(bytes(title).length > 0, "Title required");

        blogCount++;
        address[] memory selectedUsers = getRandomUsers(15);
        blogs[blogCount] = Blog(
            blogCount,
            contentHash,
            blogCoverHash,
            0,
            category,
            payable(msg.sender),
            block.timestamp,
            selectedUsers,
            0,
            0,
            false,
            false
        );

        emit BlogCreated(
            blogCount,
            contentHash,
            blogCoverHash,
            title,
            category,
            payable(msg.sender)
        );
    }

    function getRandomUsers(
        uint count
    ) internal view returns (address[] memory) {
        uint totalUsers = getAllUsers.length;
        count = count > totalUsers ? totalUsers : count;
        address[] memory selected = new address[](count);

        uint256 seed = uint256(
            keccak256(abi.encodePacked(block.difficulty, block.timestamp))
        );

        for (uint i = 0; i < count; i++) {
            uint index = (seed + i) % totalUsers;
            selected[i] = getAllUsers[index].accountAddress;
        }
        return selected;
    }

    function getUserBlogs(
        address user
    ) public view returns (Blog[] memory, Comment[][] memory) {
        uint count = 0;
        for (uint i = 1; i <= blogCount; i++) {
            if (
                blogs[i].author == user ||
                isUserSelectedForBlog(i, user) ||
                userHasPreference(blogs[i].category, user)
            ) {
                count++;
            }
        }

        Blog[] memory userBlogs = new Blog[](count);
        Comment[][] memory userBlogComments = new Comment[][](count);

        uint index = 0;
        for (uint i = 1; i <= blogCount; i++) {
            if (
                blogs[i].author == user ||
                isUserSelectedForBlog(i, user) ||
                userHasPreference(blogs[i].category, user)
            ) {
                userBlogs[index] = blogs[i];
                userBlogComments[index] = blogComments[i]; // Get all comments for the blog
                index++;
            }
        }

        return (userBlogs, userBlogComments);
    }

    function isUserSelectedForBlog(
        uint blogId,
        address user
    ) internal view returns (bool) {
        for (uint i = 0; i < blogs[blogId].selectedUsers.length; i++) {
            if (blogs[blogId].selectedUsers[i] == user) {
                return true;
            }
        }
        return false;
    }

    function userHasPreference(
        BlogCategory category,
        address user
    ) internal view returns (bool) {
        for (uint i = 0; i < userList[user].preferences.length; i++) {
            if (userList[user].preferences[i] == category) {
                return true;
            }
        }
        return false;
    }

    function voteOnBlog(uint blogId, bool approve) public {
        require(blogId > 0 && blogId <= blogCount, "Invalid blog");
        require(!hasVoted[blogId][msg.sender], "Already voted");
        require(
            block.timestamp <= blogs[blogId].createdAt + 1 days,
            "Voting period over"
        );

        Blog storage blog = blogs[blogId];
        require(!blog.isApproved && !blog.isBlocked, "Already resolved");
        require(
            isUserSelectedForBlog(blogId, msg.sender),
            "Not eligible to vote"
        );

        hasVoted[blogId][msg.sender] = true;
        if (approve) {
            blog.approveVotes++;
        } else {
            blog.rejectVotes++;
        }

        if (blog.rejectVotes > blog.selectedUsers.length / 2) {
            blog.isBlocked = true;
            blog.author.transfer(blog.tipAmount);
        }

        if (blog.approveVotes > blog.selectedUsers.length / 2) {
            blog.isApproved = true;
        }

        emit BlogVoted(blogId, msg.sender, approve);
    }

    function tipBlogAuthor(uint blogId) public payable {
        require(blogId > 0 && blogId <= blogCount, "Invalid blog");
        Blog storage blog = blogs[blogId];
        blog.author.transfer(msg.value);
        blog.tipAmount += msg.value;
        emit BlogTipped(blogId, "", blog.tipAmount, blog.author);
    }

    function addComment(uint blogId, string memory commentText) public {
        blogComments[blogId].push(
            Comment(payable(msg.sender), block.timestamp, commentText)
        );
        emit CommentAdded(blogId, msg.sender, commentText);
    }

    function getComments(uint blogId) public view returns (Comment[] memory) {
        return blogComments[blogId];
    }
}

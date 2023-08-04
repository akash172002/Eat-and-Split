import React, { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export const App = () => {
  const [friend, setFriend] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFreind] = useState(null);

  const handleAddShowFreind = () => {
    setShowAddFriend((show) => !show);
  };

  const handleAddFreinds = (friend) => {
    setFriend((friends) => [...friends, friend]);
    setShowAddFriend(false);
  };

  const handleSelection = (freind) => {
    setSelectedFreind((cur) => (cur?.id === freind.id ? null : freind));

    setShowAddFriend(false);
  };

  const handleSplitBill = (value) => {
    setFriend((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setSelectedFreind(null);
  };

  return (
    <div className="app">
      <div className="sidebar">
        <FreindsList
          freinds={friend}
          onSelectFreind={handleSelection}
          onToggle={selectedFriend}
        />

        {showAddFriend && <FormAddFreind onAddFreind={handleAddFreinds} />}

        <Button onClick={handleAddShowFreind}>
          {showAddFriend === true ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          onSelect={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
};

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FreindsList({ freinds, onSelectFreind, onToggle }) {
  return (
    <ul>
      {freinds.map((friends) => {
        return (
          <Friend
            friends={friends}
            key={friends.id}
            onSelect={onSelectFreind}
            selected={onToggle}
          />
        );
      })}
    </ul>
  );
}

function Friend({ friends, onSelect, selected }) {
  const isSelected = selected?.id === friends.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friends.image} alt={friends.name} />
      <h3>{friends.name}</h3>

      {friends.balance < 0 && (
        <p className="red">
          You Owe {friends.name} ${Math.abs(friends.balance)}
        </p>
      )}
      {friends.balance > 0 && (
        <p className="green">
          {friends.name} owes you ${Math.abs(friends.balance)}
        </p>
      )}
      {friends.balance === 0 && <p>You and {friends.name} are even</p>}
      <Button onClick={() => onSelect(friends)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFreind({ onAddFreind }) {
  const [name, setNames] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48?u=499476");

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const id = crypto.randomUUID();

    if (!name || !image) {
      return;
    }
    const newFriend = {
      name,
      image: `${image}?=${id}`,
      balance: 0,
      id: crypto.randomUUID(),
    };
    onAddFreind(newFriend);

    setNames("");
    setImage("https://i.pravatar.cc/48?u=499476");
  };

  return (
    <form className="form-add-friend" onSubmit={handleFormSubmit}>
      <label>🫂 Freind name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setNames(e.target.value)}
      />

      <label>🖼️ image url</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ onSelect, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setpaidByUser] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  const paidByFreind = bill ? bill - paidByUser : "";

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!bill || !paidByUser) return;

    onSplitBill(whoIsPaying === "user" ? paidByFreind : -paidByUser);
  };

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {onSelect.name}</h2>

      <label>💵 Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🙍 Your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setpaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />

      <label>🫂 {onSelect.name}'s Expense</label>
      <input type="text" disabled value={paidByFreind} />

      <label>🤑 who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="freind">{onSelect.name}'s</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}

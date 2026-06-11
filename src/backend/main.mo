import List "mo:core/List";

actor {
  let todos : List.List<{ id : Nat; text : Text; var completed : Bool }>;
  var nextId : Nat;

  public func addTodo(text : Text) : async Nat {
    let id = nextId;
    nextId += 1;
    todos.add({ id; text; var completed = false });
    id;
  };

  public query func getTodos() : async [{ id : Nat; text : Text; completed : Bool }] {
    todos.map<{ id : Nat; text : Text; var completed : Bool }, { id : Nat; text : Text; completed : Bool }>(
      func(t) { { id = t.id; text = t.text; completed = t.completed } }
    ).toArray();
  };

  public func toggleTodo(id : Nat) : async () {
    todos.mapInPlace(
      func(t) {
        if (t.id == id) { { id = t.id; text = t.text; var completed = not t.completed } } else { t };
      }
    );
  };

  public func deleteTodo(id : Nat) : async () {
    switch (todos.findIndex(func(t) { t.id == id })) {
      case (?idx) {
        let sz = todos.size();
        if (sz > 0) {
          let last = sz - 1 : Nat;
          if (idx < last) {
            todos.put(idx, todos.at(last));
          };
          ignore todos.removeLast();
        };
      };
      case null {};
    };
  };
};

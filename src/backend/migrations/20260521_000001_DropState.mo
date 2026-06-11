import List "mo:core/List";

module {
  type OldActor = {
    todos : List.List<{ id : Nat; text : Text; var completed : Bool }>;
    state : { var nextId : Nat };
  };

  type NewActor = {
    todos : List.List<{ id : Nat; text : Text; var completed : Bool }>;
    var nextId : Nat;
  };

  public func migration(old : OldActor) : NewActor {
    {
      todos = old.todos;
      var nextId = old.state.nextId;
    };
  };
};

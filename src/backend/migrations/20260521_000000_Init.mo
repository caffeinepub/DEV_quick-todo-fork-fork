import List "mo:core/List";

module {
  type OldActor = {};

  type NewActor = {
    todos : List.List<{ id : Nat; text : Text; var completed : Bool }>;
    state : { var nextId : Nat };
  };

  public func migration(_ : OldActor) : NewActor {
    {
      todos = List.empty<{ id : Nat; text : Text; var completed : Bool }>();
      state = { var nextId = 0 };
    };
  };
};

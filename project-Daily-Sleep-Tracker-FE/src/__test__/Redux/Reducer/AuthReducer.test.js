import { AuthReducer } from "../../../Redux/Reducer/AuthReducer/AuthReducer";
import { SET_LOGIN, SET_GET_MY_PROFILE } from "../../../Redux/type/AuthType/AuthType";

describe("AuthReducer", () => {
  const initialState = {
    user: null,
    userProfile: null,
  };

  it("should return the initial state", () => {
    const newState = AuthReducer(undefined, {});
    expect(newState).toEqual(initialState);
  });

  it("should handle SET_LOGIN", () => {
    const mockUser = { id: "123", email: "test@example.com" };
    const action = {
      type: SET_LOGIN,
      payload: mockUser,
    };
    const newState = AuthReducer(initialState, action);
    expect(newState.user).toEqual(mockUser);
    expect(newState.userProfile).toBeNull();
  });

  it("should handle SET_GET_MY_PROFILE", () => {
    const mockProfile = { name: "Tuan", age: 25 };
    const action = {
      type: SET_GET_MY_PROFILE,
      payload: mockProfile,
    };
    const newState = AuthReducer(initialState, action);
    expect(newState.userProfile).toEqual(mockProfile);
    expect(newState.user).toBeNull();
  });

  it("should return current state for unknown action type", () => {
    const action = { type: "UNKNOWN_ACTION", payload: {} };
    const newState = AuthReducer(initialState, action);
    expect(newState).toEqual(initialState);
  });
});

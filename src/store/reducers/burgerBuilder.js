import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const INITIAL_PRICE = 4;

const initialState = {
  ingredients: null,
  totalPrice: INITIAL_PRICE,
  error: false,
};


const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
};

const addIngredient = (state, action) => {
	const addedIngredient = {[action.ingredientName]: state.ingredients[action.ingredientName] + 1};
	const updatedIng = updateObject(state.ingredients, addedIngredient);
	const newState = {
		ingredients: updatedIng,
		totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName],
	};
	return updateObject(state, newState);
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_INGREDIENT: return addIngredient(state, action);
    case actionTypes.REMOVE_INGREDIENT:
			const removedIngredient = {[action.ingredientName]: state.ingredients[action.ingredientName] - 1};
			const updatedIngredients = updateObject(state.ingredients, removedIngredient);
			const updatedState = {
				ingredients: updatedIngredients,
        totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName],
			};
      return updateObject(state, updatedState);
    case actionTypes.SET_INGREDIENTS:
			return updateObject(state, {
				ingredients: action.ingredients,
				totalPrice: INITIAL_PRICE,
        error: false,
			});
    case actionTypes.FETCH_INGREDIENTS_FAILED:
      return updateObject(state, { error: true });
    default:
      return state;
  }
};

export default reducer;
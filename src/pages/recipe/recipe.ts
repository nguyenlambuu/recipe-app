import {Component, OnInit} from '@angular/core';
import {AlertController, NavController, NavParams, ToastController} from "ionic-angular";
import {Recipe} from "../../models/recipe";
import {EditRecipePage} from "../edit-recipe/edit-recipe";
import {RecipesService} from "../../services/recipes";
import {ShoppingListService} from "../../services/shopping-list";
import {ShoppingListPage} from "../shopping-list/shopping-list";

@Component({
    selector: 'page-recipe',
    templateUrl: 'recipe.html',
})
export class RecipePage implements OnInit {
    recipe: Recipe;
    index: number;


    constructor(private navCtrl: NavController,
                private navParams: NavParams,
                private alertCtrl: AlertController,
                private recipeService: RecipesService,
                private shoppingListService: ShoppingListService,
                private toastCtrl: ToastController) {

    }

    ngOnInit(): void {
        this.recipe = this.navParams.get('recipe');
        this.index = this.navParams.get('index');
    }

    onEditRecipe() {
        this.navCtrl.push(EditRecipePage, {mode: 'Edit', recipe: this.recipe, index: this.index});
    }

    onDeleteRecipe() {
        this.alertCtrl.create({
            title: 'Delete recipe?',
            message: 'Do you agree to delete this recipe?',
            buttons: [
                {
                    text: 'Agree',
                    handler: () => {
                        this.recipeService.removeRecipe(this.index);
                        this.toastCtrl.create({
                            message: 'Recipe was removed!',
                            duration: 1500
                        }).present();
                        this.navCtrl.popToRoot();
                    }
                },
                {
                    text: 'Disagree',
                    handler: () => {
                        console.log('Agree clicked');
                    }
                }
            ]
        }).present();
    }

    onAddIngredientsToShoppingList() {
        this.shoppingListService.addItems(this.recipe.ingredients);
        this.alertCtrl.create({
            title: 'Success',
            message: 'Ingredients was added to shopping list, are you want to go to shopping list page?',
            buttons: [
                {
                    text: 'Yes, please!',
                    handler: () => {
                        this.navCtrl.push(ShoppingListPage);
                    }
                },
                {
                    text: 'No, Stay there',
                    handler: () => {}
                }
            ]
        }).present();
    }

}

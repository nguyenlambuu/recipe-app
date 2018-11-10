import {Component, OnInit} from '@angular/core';
import {ActionSheetController, AlertController, NavController, NavParams, Toast, ToastController} from 'ionic-angular';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {RecipesService} from "../../services/recipes";
import {Recipe} from "../../models/recipe";


@Component({
    selector: 'page-edit-recipe',
    templateUrl: 'edit-recipe.html',
})
export class EditRecipePage implements OnInit {
    mode: string = 'New';
    selectOptions = ['Easy', 'Medium', 'Hard'];
    recipeForm: FormGroup;
    recipe: Recipe;
    index: number;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private actionSheetCtrl: ActionSheetController,
                private alertCtrl: AlertController,
                private toastCtrl: ToastController,
                private recipeService: RecipesService) {
    }

    ngOnInit(): void {
        this.mode = this.navParams.get('mode');
        if(this.mode == 'Edit') {
            this.recipe = this.navParams.get('recipe');
            this.index = this.navParams.get('index');
        }
            this.initializeForm();
    }

    onSubmit() {
        const data = this.recipeForm.value;
        let ingredients = [];
        if (data.ingredients.length > 0) {
            ingredients = data.ingredients.map( name => {return {name: name, amount: 1}});
        }


        if (this.mode == 'Edit') {
            this.recipeService.updateRecipe(this.index, data.title,
                data.description, data.difficulty, ingredients);
        } else {
            this.recipeService.addRecipe(data.title, data.description, data.difficulty,
                ingredients);
        }

        this.recipeForm.reset();
        this.navCtrl.popToRoot();
    }
    onManageInggredients() {
        const actionSheet = this.actionSheetCtrl.create({
            title: 'Modify your ingredients',
            buttons: [
                {
                    text: 'Add ingredient',
                    handler: () => {
                        this.createNewIngredientAlert().present();
                    }
                }, {
                    text: 'Remove all ingredients',
                    role: 'destructive',
                    handler: () => {
                        const formArray: FormArray = <FormArray>this.recipeForm.get('ingredients');
                        if (formArray.length > 0) {
                            for (let i = formArray.length - 1; i >= 0; i--) {
                                formArray.removeAt(i);
                            }
                            this.toastCtrl.create({
                                message: 'All ingredients were deleted!',
                                duration: 1000,
                                position: 'bottom'
                            }).present();
                        }
                    }
                }, {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    }

    private initializeForm() {
        let title = null;
        let description = null;
        let difficulty = 'Medium';
        let ingredients = [];


        if (this.mode == 'Edit') {
            title = this.recipe.title;
            description = this.recipe.description;
            difficulty = this.recipe.difficulty;
            for (let ing of this.recipe.ingredients) {
                ingredients.push(new FormControl(ing.name, Validators.required));
            }
        }

        this.recipeForm = new FormGroup({
            'title': new FormControl(title, Validators.required),
            'description': new FormControl(description, Validators.required),
            'difficulty': new FormControl(difficulty, Validators.required),
            'ingredients': new FormArray(ingredients)
        });
    }

    private createNewIngredientAlert() {
        return this.alertCtrl.create({
            title: 'Add ingredient',
            inputs: [
                {
                    name: 'name',
                    placeholder: 'Name'
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel'
                },
                {
                    text: 'Add',
                    handler: data => {
                        if (data.name.trim() == '' || data.name == null){
                            this.toastCtrl.create({
                                message: 'Please enter a valid value!',
                                duration: 1000,
                                position: 'bottom'
                            }).present();
                            return;
                        }
                        (<FormArray>this.recipeForm.get('ingredients'))
                            .push(new FormControl(data.name, Validators.required));
                        this.toastCtrl.create({
                            message: 'Item added!',
                            duration: 1000,
                            position: 'bottom'
                        }).present();
                    }
                }
            ]
        });
    }
}

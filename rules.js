class Start extends Scene {
    create() {
        console.log(this.engine.storyData);

        this.engine.setTitle(this.engine.storyData.Title); // TODO: replace this text using this.engine.storyData to find the story title
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation); // TODO: replace this text by the initial location of the story
    }
}

class Location extends Scene {
    access_key = false; 
    create(key) {
        
        
        let locationData = this.engine.storyData.Locations[key];
        this.engine.show(locationData.Body);
        
        if(locationData.Choices) { 
            for(let choice of locationData.Choices) { 
                this.engine.addChoice(choice.Text, choice.Target);
            }
        } else {
            this.engine.addChoice("The end.")
        }

        if(locationData.Interactions) {
            for(let action in locationData.Interactions) {
                this.engine.addChoice(locationData.Interactions[action].Text, {action, location: key});
            }
        }
    }

    handleChoice(choice) {
        if(choice) {
            if (typeof choice == "object") {  
                let locationData = this.engine.storyData.Locations[choice.location];
                this.engine.show(locationData.Interactions[choice.action].Result);

                // when player chooses Access Pass, the Observation Deck is unlocked
                if (choice.action === "Access Pass") {
                    this.access_key = true; 
                } 
                if (choice) {
                    this.engine.gotoScene(Location, this.engine.storyData.ReturnTo);
                    this.engine.show("You need to purchase an access pass from the lounge, please go back to it.");
                }else{
                    this.engine.gotoScene(Location, choice.location);
                }
                
                
            } 
            
            else if(choice) { 
                
                this.engine.show("&gt; "+choice);
                this.engine.show("poop");
                this.engine.gotoScene(Location, choice);

            }
        } else {
            this.engine.gotoScene(End);
        }
    }
}





class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');
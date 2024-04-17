class Start extends Scene {
    create() {
        console.log(this.engine.storyData);
        this.engine.setTitle(this.engine.storyData.Title); 
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation);
    }
}

class Location extends Scene {
 
    static hasAccessPass = false;
 
    create(key) {       
        let locationData = this.engine.storyData.Locations[key];
        this.engine.show(locationData.Body);        
        if(locationData.Choices) {
            for(let choice of locationData.Choices) {
                this.engine.addChoice(choice.Text, choice.Target);
            }
        } else {
            this.engine.addChoice("The end.");
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
                if (choice.action === "Access Pass") {
                    Location.hasAccessPass = true;
                }
                this.engine.gotoScene(Location, choice.location);
            } else {
                if (choice === "Observation Deck") {
                    if (Location.hasAccessPass) {
                        this.engine.show("&gt; "+choice);
                        this.engine.gotoScene(Location, this.engine.storyData.AccessAccept);
                    } else {
                        this.engine.show("You need to purchase an access pass from the lounge, please go back to it.");
                        this.engine.gotoScene(Location, this.engine.storyData.ReturnTo);
                    }
                } else {
                    this.engine.show("&gt; "+choice);
                    this.engine.gotoScene(Location, choice);
                }
            }
        } else {
            this.engine.gotoScene(End);
        }
    }
}



Engine.load(Start, 'myStory.json');
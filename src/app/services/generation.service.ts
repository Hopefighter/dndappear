import {Injectable} from "@angular/core";
import {UtilityService} from "./utility.service";

interface LooseObject {
  [key: string]: any
}

interface AppearanceTable {
  file: string,
  number?: number,
  condition?: string,
  modifier?: string
}

interface Race {
  race: string,
  weight: number,
  traits: {
    baseWeight: number,
    baseHeight: number,
    modWeight: string,
    modHeight: string
  },
  appearanceTables: [AppearanceTable],
  subraces?: [
    Subrace
  ]
}

interface Appearance {
  trait: string,
  weight: number
  condition?: string
}

interface Subrace {
  race: string,
  weight: number
}

@Injectable()
export class GenerationService {

  constructor( private utilityService: UtilityService ) {
  }

  public generateCharacter() {
    let character: LooseObject = {};

    //Obtain character info
    const jsonSex: any = this.drawWeightedItem(this.utilityService.retrieveJSON('sex'));
    const jsonRace: any = this.drawWeightedItem(this.utilityService.retrieveJSON('races'));

    const race: Race = <Race>jsonRace;
    let subrace = '';
    if(race.subraces != undefined) {
      subrace = ' (' + this.drawWeightedItem(race.subraces).race + ')';
    }

    const heightMod = this.rollDice(race.traits.modHeight);
    const weightMod = this.rollDice(race.traits.modWeight);
    const height: number = race.traits.baseHeight + heightMod;
    const weight: number = race.traits.baseWeight + (weightMod * heightMod);

    //fill always present information into character
    character['race'] = race.race + subrace;
    character['sex'] = jsonSex.sex;
    character['height'] = height;
    character['weight'] = weight;

    //iterate through appearance tables
    race.appearanceTables.forEach(table =>{
      const jsonTableAppearance = this.utilityService.retrieveJSON('appearances/' + table.file);
      const rollNumber = table.number ? table.number : 1;
      for(let i = 0; i < rollNumber; i++) {
        character[table.file] = this.drawWeightedItem(jsonTableAppearance);
      }
    });

    console.log(character);
  }

  /*
   * Draw a random entry from json list @input filename
   */
  drawWeightedItem(list: Array<any>) : any {

    let result;
    let target: number;
    let totalWeight = 0;

    list.forEach(entry => totalWeight += entry.weight);
    target = this.utilityService.randomInt(totalWeight);

    list.some(entry => {
      if (target <= entry.weight) {
        result = entry;
        return true;
      } else {
        target -= entry.weight;
        return false;
      }
    });
    return result;
  }

  /*
   * Rolls dice based on formula xdy where x is the number of dice and y is the number of sides of the dice
   * @input rollCommand: the roll command
   */
  rollDice(rollCommand: string) {
    if(rollCommand.match('\\d+d\\d+')) {
      const resolvedCommand: Array<any> = rollCommand.split('d');
      let result = 0;
      for(var i = 0; i < resolvedCommand[0]; i++) {
        result += this.utilityService.randomInt(resolvedCommand[1]);
      }
      return result;
    } else {
      console.error('invalid dice rolling formula');
      return 0;
    }
  }
}

import {Injectable} from "@angular/core";

@Injectable()
export class UtilityService {

  /*
   * load JSON file from the assets/json folder with @input filename .json
   */
  retrieveJSON(filename: String) {
    try {
      return require('../assets/json/' + filename + '.json');
    } catch (e) {
      console.error('couldn\'t find file named ../assets/json/' + filename + '.json');
      return null;
    }
  }

  /*
   * generate random Integer between 1 and @input max
   */
  randomInt(max: number) {
    return Math.floor(Math.random() * (max) + 1);
  }
}

import { Component } from '@angular/core';
import { GenerationService } from "./services/generation.service";
import {UtilityService} from "./services/utility.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'dndappear';

  constructor( private generationService: GenerationService) {
  }

  startGeneration() {
    this.generationService.generateCharacter();
  }

}

import { Component } from '@angular/core';
import { Satellite } from './satellite';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'orbit-report';
  sourceList: Satellite[];
  displayList: Satellite[];
  constructor() {
    this.displayList = [];
    this.sourceList = [];
    const satellitesUrl =
      'https://handlers.education.launchcode.org/static/satellites.json';

    window.fetch(satellitesUrl).then(
      function (response) {
        response.json().then(
          function (data: { satellites: any }) {
            const fetchedSatellites = data.satellites;
            fetchedSatellites.forEach((sat) => {
              const satellite: Satellite = {
                name: sat.name,
                orbitType: sat.orbitType,
                type: sat.type,
                operational: sat.operational,
                launchDate: sat.launchDate,
                shouldShowWarning: () => {
                  return sat.type.toLowerCase() === 'space debris'
                    ? true
                    : false;
                },
              };
              this.sourceList.push(satellite);
              this.displayList = this.sourceList;
            });
          }.bind(this)
        );
      }.bind(this)
    );
  }

  search(searchTerm: string): void {
    console.log('search', searchTerm);
    const matchingSatellites: Satellite[] = [];
    searchTerm = searchTerm.toLowerCase();
    for (let i = 0; i < this.sourceList.length; i++) {
      const name = this.sourceList[i].name.toLowerCase();
      if (name.indexOf(searchTerm) >= 0) {
        matchingSatellites.push(this.sourceList[i]);
      }
    }
    // assign this.displayList to be the array of matching satellites
    // this will cause Angular to re-make the table, but now only containing matches
    this.displayList = matchingSatellites;
  }
}

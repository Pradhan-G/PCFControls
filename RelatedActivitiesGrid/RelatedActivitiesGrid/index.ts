import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { ActivitiesGrid } from "./DetailsList-Simple";

export class RelatedActivitiesGrid
  implements ComponentFramework.StandardControl<IInputs, IOutputs>
{
  private _container: any;

  constructor() {}

  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ) {
    this._container = container;
  }

  public updateView(context: ComponentFramework.Context<IInputs>): void {
    let accountid = context.parameters.accountid?.raw;
    let appProps: any;

    appProps = {
      accountid: accountid,
      pcfContext: context,
    };

    ReactDOM.render(
      React.createElement(ActivitiesGrid, appProps),
      this._container
    );
  }

  public getOutputs(): IOutputs {
    return {};
  }

  public destroy(): void {}
}

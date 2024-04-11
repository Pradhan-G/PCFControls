import * as React from "react";
import { Fabric } from "office-ui-fabric-react/lib/Fabric";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  IColumn,
} from "office-ui-fabric-react/lib/DetailsList";
import { Link } from "office-ui-fabric-react/lib/Link";
import { initializeIcons } from "@uifabric/icons";
import Stack from "office-ui-fabric-react/lib/components/Stack/Stack";
import { Text } from "office-ui-fabric-react/lib/Text";

initializeIcons();

export interface IDetailsListState {
  columns: IColumn[];
  items: IDetailsListItem[];
  announcedMessage?: string;
}

export interface IDetailsListItem {
  key: string;
  subject: string;
  regardingobjectid: string;
  activitytypecode: string;
  statecode: string;
  ownerid: string;
  scheduledend: string;
  createdon: string;
  modifiedon: string;
}

export class ActivitiesGrid extends React.Component<any, IDetailsListState> {
  private _allItems: IDetailsListItem[];
  private _pcfContext: any;
  private _accountid: string;
  private _announcedMessage: string = "loading…";

  constructor(props: any) {
    super(props);
    this._pcfContext = props.pcfContext;
    this._accountid = props.accountid;

    const _relatedContactActivitiesfetchXml: string =
      "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>" +
      "  <entity name='activitypointer'>" +
      "    <attribute name='subject' />" +
      "    <attribute name='ownerid' />" +
      "    <attribute name='regardingobjectid' />" +
      "    <attribute name='activitytypecode' />" +
      "    <attribute name='statecode' />" +
      "    <attribute name='scheduledstart' />" +
      "    <attribute name='scheduledend' />" +
      "    <attribute name='instancetypecode' />" +
      "    <attribute name='modifiedon' />" +
      "    <attribute name='createdon' />" +
      "    <attribute name='activityid' />" +
      "    <order attribute='modifiedon' descending='true' />" +
      "    <filter type='and'>" +
      "      <condition attribute='isregularactivity' operator='eq' value='1' />" +
      "    </filter>" +
      "    <link-entity name='contact' from='contactid' to='regardingobjectid' link-type='inner' alias='ldc'>" +
      "      <filter type='and'>" +
      "        <condition attribute='parentcustomerid' operator='eq' value='" +
      this._accountid +
      "' />" +
      "      </filter>" +
      "    </link-entity>" +
      "  </entity>" +
      "</fetch>";

    const _accountActivitiesfetchXml: string =
      "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>" +
      "  <entity name='activitypointer'>" +
      "    <attribute name='subject' />" +
      "    <attribute name='ownerid' />" +
      "    <attribute name='regardingobjectid' />" +
      "    <attribute name='activitytypecode' />" +
      "    <attribute name='statecode' />" +
      "    <attribute name='scheduledstart' />" +
      "    <attribute name='scheduledend' />" +
      "    <attribute name='instancetypecode' />" +
      "    <attribute name='modifiedon' />" +
      "    <attribute name='createdon' />" +
      "    <attribute name='activityid' />" +
      "    <order attribute='modifiedon' descending='true' />" +
      "    <filter type='and'>" +
      "      <condition attribute='isregularactivity' operator='eq' value='1' />" +
      "      <condition attribute='regardingobjectid' operator='eq' value='" +
      this._accountid +
      "' />" +
      "    </filter>" +
      "  </entity>" +
      "</fetch>";

    let _accountActivitiesItems: any[] = [];
    let _relatedContactActivitiesItems: any[] = [];
    let _allActivities: any[] = [];

    this._pcfContext.webAPI
      .retrieveMultipleRecords(
        "activitypointer",
        "?fetchXml=" + encodeURIComponent(_accountActivitiesfetchXml)
      )
      .then(
        (results: any) => {
          _accountActivitiesItems = this.populateRecords(results);
          this._pcfContext.webAPI
            .retrieveMultipleRecords(
              "activitypointer",
              "?fetchXml=" +
                encodeURIComponent(_relatedContactActivitiesfetchXml)
            )
            .then(
              (relatedResults: any) => {
                _relatedContactActivitiesItems =
                  this.populateRecords(relatedResults);
                _allActivities = [
                  ..._accountActivitiesItems,
                  ..._relatedContactActivitiesItems,
                ];
                this._allItems = _allActivities;
                this.setState({
                  items: _allActivities,
                  columns: [
                    {
                      key: "column1",
                      name: "Subject",
                      fieldName: "subject",
                      minWidth: 100,
                      maxWidth: 200,
                      isResizable: true,
                    },
                    {
                      key: "column2",
                      name: "Regarding",
                      fieldName: "regardingobjectid",
                      minWidth: 100,
                      maxWidth: 200,
                      isResizable: true,
                      onRender: (item: any) => this.renderRegardingColumn(item),
                    },
                    {
                      key: "column3",
                      name: "Activity Type",
                      fieldName: "activitytypecode",
                      minWidth: 100,
                      maxWidth: 200,
                      isResizable: true,
                    },
                    {
                      key: "column4",
                      name: "State",
                      fieldName: "statecode",
                      minWidth: 100,
                      maxWidth: 200,
                      isResizable: true,
                    },
                    {
                      key: "column5",
                      name: "Owner",
                      fieldName: "ownerid",
                      minWidth: 100,
                      maxWidth: 200,
                      isResizable: true,
                    },
                    {
                      key: "column6",
                      name: "Scheduled End",
                      fieldName: "scheduledend",
                      minWidth: 100,
                      maxWidth: 200,
                      isResizable: true,
                    },
                    {
                      key: "column7",
                      name: "Created On",
                      fieldName: "createdon",
                      minWidth: 100,
                      maxWidth: 200,
                      isResizable: true,
                    },
                    {
                      key: "column8",
                      name: "Modified On",
                      fieldName: "modifiedon",
                      minWidth: 100,
                      maxWidth: 200,
                      isResizable: true,
                    },
                  ],
                  announcedMessage:
                    _allActivities.length === 0 ? "No activities found." : "",
                });
              },
              (error: any) => {
                console.error(
                  "Error retrieving related contact activities: ",
                  error
                );
                this.setState({
                  items: [],
                  columns: [],
                  announcedMessage: "Error loading activities.",
                });
              }
            );
        },
        (error: any) => {
          console.error("Error retrieving account activities: ", error);
          this.setState({
            items: [],
            columns: [],
            announcedMessage: "Error loading activities.",
          });
        }
      );

    this.state = {
      columns: [],
      items: [],
      announcedMessage: this._announcedMessage,
    };
  }

  private populateRecords(results: any): IDetailsListItem[] {
    return results.entities.map((entity: any) => {
      return {
        key: entity.activityid,
        subject: entity.subject,
        regardingobjectid: entity.regardingobjectid.name,
        activitytypecode: entity.activitytypecode,
        statecode: entity.statecode,
        ownerid: entity.ownerid.name,
        scheduledend: entity.scheduledend,
        createdon: entity.createdon,
        modifiedon: entity.modifiedon,
      };
    });
  }

  private renderRegardingColumn(item: any): JSX.Element {
    const regardingObjectId = item.regardingobjectid;
    const regardingObjectName = item.regardingobjectid.name;
    const linkUrl =
      this._pcfContext.page.getClientUrl() +
      "/main.aspx?etc=" +
      regardingObjectId.LogicalName +
      "&id=" +
      regardingObjectId.Id +
      "&pagetype=entityrecord";
    return <Link href={linkUrl}>{regardingObjectName}</Link>;
  }

  public render(): JSX.Element {
    const { columns, items, announcedMessage } = this.state;

    return (
      <Fabric>
        <Stack tokens={{ childrenGap: 10 }}>
          <Text variant="large">{announcedMessage}</Text>
          <DetailsList
            items={items}
            columns={columns}
            setKey="set"
            layoutMode={DetailsListLayoutMode.justified}
            selectionMode={SelectionMode.none}
            ariaLabelForSelectionColumn="Toggle selection"
            ariaLabelForSelectAllCheckbox="Toggle selection for all items"
          />
        </Stack>
      </Fabric>
    );
  }
}

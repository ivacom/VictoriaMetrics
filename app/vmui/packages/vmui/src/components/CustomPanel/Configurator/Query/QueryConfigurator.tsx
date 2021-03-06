import React, {FC, useState} from "preact/compat";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import QueryEditor from "./QueryEditor";
import {useAppDispatch, useAppState} from "../../../../state/common/StateContext";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import AdditionalSettings from "./AdditionalSettings";
import {ErrorTypes} from "../../../../types";

export interface QueryConfiguratorProps {
  error?: ErrorTypes | string;
  queryOptions: string[]
}

const QueryConfigurator: FC<QueryConfiguratorProps> = ({error, queryOptions}) => {

  const {query, queryHistory, queryControls: {autocomplete}} = useAppState();
  const [stateQuery, setStateQuery] = useState(query || []);
  const dispatch = useAppDispatch();

  const updateHistory = () => {
    dispatch({
      type: "SET_QUERY_HISTORY", payload: stateQuery.map((q, i) => {
        const h = queryHistory[i] || {values: []};
        const queryEqual = q === h.values[h.values.length - 1];
        return {
          index: h.values.length - Number(queryEqual),
          values: !queryEqual && q ? [...h.values, q] : h.values
        };
      })
    });
  };

  const onRunQuery = () => {
    updateHistory();
    dispatch({type: "SET_QUERY", payload: stateQuery});
    dispatch({type: "RUN_QUERY"});
  };

  const onAddQuery = () => {
    setStateQuery(prev => [...prev, ""]);
  };

  const onRemoveQuery = (index: number) => {
    setStateQuery(prev => prev.filter((q, i) => i !== index));
  };

  const onSetQuery = (value: string, index: number) => {
    setStateQuery(prev => prev.map((q, i) => i === index ? value : q));
  };

  const setHistoryIndex = (step: number, indexQuery: number) => {
    const {index, values} = queryHistory[indexQuery];
    const newIndexHistory = index + step;
    if (newIndexHistory < 0 || newIndexHistory >= values.length) return;
    onSetQuery(values[newIndexHistory] || "", indexQuery);
    dispatch({
      type: "SET_QUERY_HISTORY_BY_INDEX",
      payload: {value: {values, index: newIndexHistory}, queryNumber: indexQuery}
    });
  };
  return <Box boxShadow="rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;" p={4} pb={2} m={-4} mb={2}>
    <Box>
      {stateQuery.map((q, i) =>
        <Box key={i} display="grid" gridTemplateColumns="1fr auto auto" gap="4px" width="100%"
          mb={i === stateQuery.length - 1 ? 0 : 2.5}>
          <QueryEditor
            query={stateQuery[i]} index={i} autocomplete={autocomplete} queryOptions={queryOptions}
            error={error} setHistoryIndex={setHistoryIndex} runQuery={onRunQuery} setQuery={onSetQuery}
            label={`Query ${i + 1}`}/>
          {i === 0 && <Tooltip title="Execute Query">
            <IconButton onClick={onRunQuery} sx={{height: "49px", width: "49px"}}>
              <PlayCircleOutlineIcon/>
            </IconButton>
          </Tooltip>}
          {stateQuery.length < 2 && <Tooltip title="Add Query">
            <IconButton onClick={onAddQuery} sx={{height: "49px", width: "49px"}}>
              <AddCircleOutlineIcon/>
            </IconButton>
          </Tooltip>}
          {i > 0 && <Tooltip title="Remove Query">
            <IconButton onClick={() => onRemoveQuery(i)} sx={{height: "49px", width: "49px"}}>
              <HighlightOffIcon/>
            </IconButton>
          </Tooltip>}
        </Box>)}
    </Box>
    <Box mt={3}>
      <AdditionalSettings/>
    </Box>
  </Box>;
};

export default QueryConfigurator;

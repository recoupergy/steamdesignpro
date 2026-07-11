"use client";

import { useId } from "react";
import type { ManufacturerRecommendation } from "@/lib/manufacturer-adapter";
import {
  STARTER_CONFIGURATIONS,
  feetToInputDistance,
  inchesToInputLength,
  inputDistanceToFeet,
  inputLengthToInches,
  type PlannerState,
  type Wall,
} from "@/lib/planner-schema";
import { FINISH_LABELS } from "@/lib/kohler/controls";
import { usePlannerStore } from "@/store/planner-store";

const walls: Wall[] = ["north", "east", "south", "west"];

function FieldGroup({ title, children, open = false }: { title: string; children: React.ReactNode; open?: boolean }) {
  return (
    <details className="control-group" open={open}>
      <summary>{title}</summary>
      <div className="control-group-body">{children}</div>
    </details>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly { value: string; label: string }[];
}) {
  const id = useId();
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function NumberField({
  label,
  value,
  unit,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  const id = useId();
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <span className="number-input-wrap">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          value={Number.isFinite(value) ? Math.round(value * 100) / 100 : ""}
          min={min}
          max={max}
          step={step}
          onChange={(event) => {
            const next = event.target.valueAsNumber;
            if (Number.isFinite(next)) onChange(next);
          }}
        />
        <span aria-hidden="true">{unit}</span>
      </span>
    </label>
  );
}

function PositionField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  const id = useId();
  return (
    <label className="range-field" htmlFor={id}>
      <span>
        {label} <output htmlFor={id}>{Math.round(value * 100)}%</output>
      </span>
      <input id={id} type="range" min="12" max="88" step="1" value={Math.round(value * 100)} onChange={(event) => onChange(Number(event.target.value) / 100)} />
    </label>
  );
}

export function PlannerControls({ recommendation }: { recommendation: ManufacturerRecommendation }) {
  const state = usePlannerStore((store) => store.present);
  const update = usePlannerStore((store) => store.update);
  const loadStarter = usePlannerStore((store) => store.loadStarter);
  const unitLabel = state.units === "metric" ? "cm" : "ft";
  const lengthValue = (inches: number) => (state.units === "metric" ? inchesToInputLength(inches, "metric") : inches / 12);
  const toInches = (value: number) => (state.units === "metric" ? inputLengthToInches(value, "metric") : value * 12);
  const wallOptions = walls.map((wall) => ({ value: wall, label: wall[0]!.toUpperCase() + wall.slice(1) }));
  const updateBench = (bench: Partial<PlannerState["bench"]>) =>
    update((current) => ({ ...current, bench: { ...current.bench, ...bench } }));

  return (
    <form className="planner-controls" onSubmit={(event) => event.preventDefault()}>
      <div className="controls-intro">
        <div>
          <p className="eyebrow">Room inputs</p>
          <h2>Plan the enclosure</h2>
        </div>
        <SelectField
          label="Starter"
          value=""
          onChange={(value) => value && loadStarter(value as keyof typeof STARTER_CONFIGURATIONS)}
          options={[
            { value: "", label: "Choose…" },
            { value: "compact", label: "Compact 4 × 3.5" },
            { value: "glass-corner", label: "Glass corner" },
            { value: "anthem-spa", label: "Anthem+ spa" },
          ]}
        />
      </div>

      <div className="unit-switch" role="group" aria-label="Measurement units">
        <button type="button" aria-pressed={state.units === "us"} onClick={() => update({ units: "us" })}>
          US
        </button>
        <button type="button" aria-pressed={state.units === "metric"} onClick={() => update({ units: "metric" })}>
          Metric
        </button>
      </div>

      <div className="dimension-grid">
        <NumberField label="Width" value={lengthValue(state.widthInches)} unit={unitLabel} min={state.units === "metric" ? 91.4 : 3} max={state.units === "metric" ? 609.6 : 20} step={state.units === "metric" ? 1 : 0.25} onChange={(value) => update({ widthInches: toInches(value) })} />
        <NumberField label="Depth" value={lengthValue(state.depthInches)} unit={unitLabel} min={state.units === "metric" ? 91.4 : 3} max={state.units === "metric" ? 609.6 : 20} step={state.units === "metric" ? 1 : 0.25} onChange={(value) => update({ depthInches: toInches(value) })} />
        <NumberField label="Finished height" value={lengthValue(state.heightInches)} unit={unitLabel} min={state.units === "metric" ? 182.9 : 6} max={state.units === "metric" ? 365.8 : 12} step={state.units === "metric" ? 1 : 0.25} onChange={(value) => update({ heightInches: toInches(value) })} />
      </div>

      <FieldGroup title="Enclosure & door" open>
        <SelectField
          label="Primary interior surface"
          value={state.surfaceMaterial}
          onChange={(value) => update({ surfaceMaterial: value as PlannerState["surfaceMaterial"] })}
          options={[
            { value: "porcelain-ceramic-tile", label: "Porcelain / ceramic tile" },
            { value: "natural-stone", label: "Natural stone" },
            { value: "glass-tile", label: "Glass tile" },
            { value: "solid-surface", label: "Solid surface" },
            { value: "other", label: "Other / mixed" },
          ]}
        />
        <div className="two-column-fields">
          <SelectField label="Door wall" value={state.doorWall} onChange={(value) => update({ doorWall: value as Wall })} options={wallOptions} />
          <SelectField
            label="Door swing"
            value={state.doorSwing}
            onChange={(value) => update({ doorSwing: value as PlannerState["doorSwing"] })}
            options={[
              { value: "out-left", label: "Out / left" },
              { value: "out-right", label: "Out / right" },
              { value: "in-left", label: "In / left" },
              { value: "in-right", label: "In / right" },
            ]}
          />
        </div>
        <NumberField label="Door width" value={lengthValue(state.doorWidthInches)} unit={unitLabel} min={state.units === "metric" ? 61 : 2} max={state.units === "metric" ? 121.9 : 4} step={state.units === "metric" ? 1 : 0.1} onChange={(value) => update({ doorWidthInches: toInches(value) })} />
        <fieldset className="checkbox-fieldset">
          <legend>Glass walls</legend>
          <div>
            {walls.map((wall) => (
              <label key={wall}>
                <input
                  type="checkbox"
                  checked={state.glassWalls.includes(wall)}
                  onChange={(event) =>
                    update({
                      glassWalls: event.target.checked
                        ? [...state.glassWalls, wall]
                        : state.glassWalls.filter((candidate) => candidate !== wall),
                    })
                  }
                />
                <span>{wall}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </FieldGroup>

      <FieldGroup title="Bench">
        <div className="two-column-fields">
          <SelectField
            label="Type"
            value={state.bench.type}
            onChange={(value) => updateBench({ type: value as PlannerState["bench"]["type"] })}
            options={[
              { value: "none", label: "None" },
              { value: "floating", label: "Floating" },
              { value: "built-in", label: "Built-in" },
              { value: "corner", label: "Corner" },
            ]}
          />
          <SelectField label="Wall" value={state.bench.wall} onChange={(value) => updateBench({ wall: value as Wall })} options={wallOptions} />
        </div>
        {state.bench.type !== "none" ? (
          <div className="dimension-grid bench-dimensions">
            <NumberField label="Width" value={lengthValue(state.bench.widthInches)} unit={unitLabel} min={state.units === "metric" ? 45.7 : 1.5} max={state.units === "metric" ? 304.8 : 10} step={state.units === "metric" ? 1 : 0.25} onChange={(value) => updateBench({ widthInches: toInches(value) })} />
            <NumberField label="Depth" value={lengthValue(state.bench.depthInches)} unit={unitLabel} min={state.units === "metric" ? 30.5 : 1} max={state.units === "metric" ? 76.2 : 2.5} step={state.units === "metric" ? 1 : 0.1} onChange={(value) => updateBench({ depthInches: toInches(value) })} />
            <NumberField label="Height" value={lengthValue(state.bench.heightInches)} unit={unitLabel} min={state.units === "metric" ? 38.1 : 1.25} max={state.units === "metric" ? 61 : 2} step={state.units === "metric" ? 1 : 0.1} onChange={(value) => updateBench({ heightInches: toInches(value) })} />
          </div>
        ) : null}
      </FieldGroup>

      <FieldGroup title="Shower & steam package" open>
        <SelectField
          label="Shower controls"
          value={state.showerType}
          onChange={(value) => update({ showerType: value as PlannerState["showerType"] })}
          options={[
            { value: "mechanical", label: "Mechanical shower" },
            { value: "anthem-plus", label: "Anthem+ digital" },
            { value: "dtv-plus", label: "DTV+ digital" },
          ]}
        />
        <SelectField
          label="Steam-head style"
          value={state.steamHeadStyle}
          onChange={(value) => update({ steamHeadStyle: value as PlannerState["steamHeadStyle"] })}
          options={[
            { value: "round", label: "Round" },
            { value: "square", label: "Square — K-32310" },
            { value: "linear", label: "Linear — K-32309" },
          ]}
        />
        <SelectField label="Finish" value={state.finish} onChange={(value) => update({ finish: value as PlannerState["finish"] })} options={(recommendation.accessoryPackage?.availableFinishes ?? ["CP"]).map((finish) => ({ value: finish, label: `${FINISH_LABELS[finish as keyof typeof FINISH_LABELS] ?? finish} (${finish})` }))} />
      </FieldGroup>

      <FieldGroup title="Fixture placement">
        <div className="two-column-fields">
          <SelectField label="Steam-head wall" value={state.steamHeadWall} onChange={(value) => update({ steamHeadWall: value as Wall })} options={wallOptions} />
          <SelectField label="Controller wall" value={state.controllerWall} onChange={(value) => update({ controllerWall: value as Wall })} options={wallOptions} />
        </div>
        <PositionField label="Steam-head position" value={state.steamHeadPosition} onChange={(value) => update({ steamHeadPosition: value })} />
        {recommendation.generator?.configuration === "tandem" ? (
          <>
            <SelectField
              label="Second steam-head wall"
              value={state.secondarySteamHeadWall}
              onChange={(value) => update({ secondarySteamHeadWall: value as Wall })}
              options={wallOptions}
            />
            <PositionField
              label="Second steam-head position"
              value={state.secondarySteamHeadPosition}
              onChange={(value) => update({ secondarySteamHeadPosition: value })}
            />
          </>
        ) : null}
        <PositionField label="Controller position" value={state.controllerPosition} onChange={(value) => update({ controllerPosition: value })} />
        <div className="two-column-fields">
          <SelectField label="Shower fixture wall" value={state.fixtureWall} onChange={(value) => update({ fixtureWall: value as Wall })} options={wallOptions} />
          <PositionField label="Fixture position" value={state.fixturePosition} onChange={(value) => update({ fixturePosition: value })} />
        </div>
      </FieldGroup>

      <FieldGroup title="Ceiling & generator">
        <SelectField
          label="Ceiling slope"
          value={state.ceilingSlopeDirection}
          onChange={(value) => update({ ceilingSlopeDirection: value as PlannerState["ceilingSlopeDirection"], ceilingSlopeDropInches: value === "none" ? 0 : Math.max(3, state.ceilingSlopeDropInches) })}
          options={[{ value: "none", label: "Level" }, ...wallOptions.map((option) => ({ ...option, label: `Falls to ${option.label}` }))]}
        />
        {state.ceilingSlopeDirection !== "none" ? <NumberField label="Slope drop" value={state.units === "metric" ? state.ceilingSlopeDropInches * 2.54 : state.ceilingSlopeDropInches} unit={state.units === "metric" ? "cm" : "in"} min={state.units === "metric" ? 2.5 : 1} max={state.units === "metric" ? 61 : 24} step={state.units === "metric" ? 1 : 0.5} onChange={(value) => update({ ceilingSlopeDropInches: state.units === "metric" ? value / 2.54 : value })} /> : null}
        <SelectField
          label="Generator location"
          value={state.generatorLocation}
          onChange={(value) => update({ generatorLocation: value as PlannerState["generatorLocation"] })}
          options={[
            { value: "adjacent-closet", label: "Adjacent closet" },
            { value: "vanity", label: "Vanity" },
            { value: "basement", label: "Basement" },
            { value: "attic", label: "Attic" },
            { value: "mechanical-room", label: "Mechanical room" },
            { value: "other", label: "Other" },
          ]}
        />
        <NumberField
          label="Routed distance"
          value={feetToInputDistance(state.generatorDistanceFt, state.units)}
          unit={state.units === "metric" ? "m" : "ft"}
          min={0}
          max={state.units === "metric" ? 30.48 : 100}
          step={state.units === "metric" ? 0.1 : 0.5}
          onChange={(value) => update({ generatorDistanceFt: inputDistanceToFeet(value, state.units) })}
        />
      </FieldGroup>

      <FieldGroup title="Project notes">
        <label className="field" htmlFor="exterior-wall-notes">
          <span>Exterior-wall notes</span>
          <textarea id="exterior-wall-notes" value={state.exteriorWallNotes} maxLength={500} placeholder="Insulation, climate, assembly…" onChange={(event) => update({ exteriorWallNotes: event.target.value })} />
        </label>
        <label className="field" htmlFor="window-notes">
          <span>Window notes</span>
          <textarea id="window-notes" value={state.windowNotes} maxLength={500} placeholder="Size, sill, glazing, location…" onChange={(event) => update({ windowNotes: event.target.value })} />
        </label>
      </FieldGroup>
    </form>
  );
}

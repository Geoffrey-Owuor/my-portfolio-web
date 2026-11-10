"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, PenLine, Plus, Trash2 } from "lucide-react";
import apiClient from "@/lib/AxiosClient";
import ConfirmationDialog from "../Modules/ConfirmationDialog";
import EmptyState from "../Modules/EmptyState";
import { LoadingCircle } from "../Modules/LoadingCircle";
import { useToast } from "../Modules/Toaster";
import { capitalize, iconButtonClass, MANAGE_LISTS } from "./manageLists";
import ResourceFormModal from "./ResourceFormModal";

// Long skill text is fine on screen, but too much for a button's name.
const shortLabel = (text) =>
  text.length > 60 ? `${text.slice(0, 60)}…` : text;

// One database-backed list: add, edit, delete and (where the list has a manual
// order) move rows up and down. `rows` is null when the read failed.
const ResourceList = ({ resource, rows, heading, note }) => {
  const config = MANAGE_LISTS[resource];
  const router = useRouter();
  const toast = useToast();

  // { row } while the form is open; row is null when adding.
  const [editing, setEditing] = useState(null);
  const [confirmingDelete, setConfirmingDelete] = useState(null);
  const [removing, setRemoving] = useState(false);
  const [moving, setMoving] = useState(false);
  // The submitted id order, shown until the refreshed rows arrive.
  const [pendingOrder, setPendingOrder] = useState(null);
  const [announcement, setAnnouncement] = useState("");

  const listRef = useRef(null);
  const focusAfterMove = useRef(null);

  useEffect(() => {
    setPendingOrder(null);
  }, [rows]);

  // The moved row's button keeps focus. At the end of the list that button is
  // disabled, so focus goes to the row's other move button.
  useLayoutEffect(() => {
    const target = focusAfterMove.current;
    if (!target) return;
    focusAfterMove.current = null;

    const row = listRef.current?.querySelector(`[data-row="${target.id}"]`);
    const button =
      row?.querySelector(`[data-move="${target.direction}"]:not(:disabled)`) ??
      row?.querySelector("[data-move]:not(:disabled)");
    button?.focus();
  }, [pendingOrder]);

  if (rows === null) {
    return (
      <section>
        {heading && (
          <h2 className="text-text-primary text-h3 mb-4 font-semibold">
            {heading}
          </h2>
        )}
        <EmptyState command={`manage ${resource}`} failed />
      </section>
    );
  }

  const byId = new Map(rows.map((row) => [row.id, row]));
  const display = pendingOrder
    ? pendingOrder.map((id) => byId.get(id)).filter(Boolean)
    : rows;

  const handleMove = async (index, direction) => {
    if (moving) return;

    const target = direction === "up" ? index - 1 : index + 1;
    const ids = display.map((row) => row.id);
    [ids[index], ids[target]] = [ids[target], ids[index]];

    focusAfterMove.current = { id: display[index].id, direction };
    setPendingOrder(ids);
    setMoving(true);
    setAnnouncement(
      `Moved ${shortLabel(config.title(display[index]))} to position ${target + 1} of ${ids.length}.`,
    );

    try {
      await apiClient.put(`/manage/${resource}/reorder`, { ids });
      router.refresh();
    } catch (error) {
      console.error(`Error reordering ${resource}:`, error);
      setPendingOrder(null);
      toast.error(error.response?.data?.message || error.message, {
        title: "Couldn't save the new order",
      });
    } finally {
      setMoving(false);
    }
  };

  const handleDelete = async () => {
    const row = confirmingDelete;
    setConfirmingDelete(null);
    setRemoving(true);

    try {
      await apiClient.delete(`/manage/${resource}/${row.id}`);
      toast.success("It's no longer on the site.", {
        title: `${capitalize(config.noun)} deleted`,
      });
      router.refresh();
    } catch (error) {
      console.error(`Error deleting from ${resource}:`, error);
      toast.error(error.response?.data?.message || error.message, {
        title: `Couldn't delete the ${config.noun}`,
      });
    } finally {
      setRemoving(false);
    }
  };

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="min-w-0">
          {heading && (
            <h2 className="text-text-primary text-h3 font-semibold">
              {heading}
            </h2>
          )}
          {note && <p className="text-text-muted mt-1 text-sm">{note}</p>}
        </div>
        <button
          type="button"
          onClick={() => setEditing({ row: null })}
          className="bg-text-primary text-surface rounded-control ml-auto inline-flex shrink-0 cursor-pointer items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add {config.noun}
        </button>
      </div>

      {display.length === 0 ? (
        <EmptyState
          command={`manage ${resource}`}
          emptyMessage={`No ${config.noun}s yet.`}
        />
      ) : (
        <ul ref={listRef} className="space-y-2">
          {display.map((row, index) => {
            const label = shortLabel(config.title(row));
            return (
              <li
                key={row.id}
                data-row={row.id}
                className="border-border-subtle bg-surface rounded-card flex flex-col gap-2 border p-4 sm:flex-row sm:items-center sm:gap-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-text-primary line-clamp-2 text-sm font-medium wrap-anywhere">
                    {config.title(row)}
                  </p>
                  {config.detail && (
                    <p className="text-text-muted mt-1 truncate text-sm">
                      {config.detail(row)}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 items-center justify-end gap-1">
                  {config.reorderable && (
                    <>
                      <button
                        type="button"
                        data-move="up"
                        onClick={() => handleMove(index, "up")}
                        disabled={index === 0}
                        aria-label={`Move ${label} up`}
                        className={iconButtonClass}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        data-move="down"
                        onClick={() => handleMove(index, "down")}
                        disabled={index === display.length - 1}
                        aria-label={`Move ${label} down`}
                        className={iconButtonClass}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => setEditing({ row })}
                    aria-label={`Edit ${label}`}
                    className={iconButtonClass}
                  >
                    <PenLine className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingDelete(row)}
                    aria-label={`Delete ${label}`}
                    className={`${iconButtonClass} hover:text-danger`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <p className="sr-only" role="status">
        {announcement}
      </p>

      {editing && (
        <ResourceFormModal
          resource={resource}
          row={editing.row}
          onClose={() => setEditing(null)}
        />
      )}

      {confirmingDelete && (
        <ConfirmationDialog
          title={`Delete ${config.noun}`}
          message={`Delete "${shortLabel(config.title(confirmingDelete))}"? This can't be undone.`}
          showConfirmation
          onConfirm={handleDelete}
          onCancel={() => setConfirmingDelete(null)}
        />
      )}

      {removing && <LoadingCircle />}
    </section>
  );
};

export default ResourceList;
